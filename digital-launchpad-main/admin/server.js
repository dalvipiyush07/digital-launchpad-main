const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const compression = require('compression');
const morgan = require('morgan');

// Load & Validate Environment Variables First
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { validateEnv } = require('./utils/env');
validateEnv();

const { supabase, uploadToSupabase, deleteFromSupabase } = require('./utils/supabase');
const { requireAdmin, verifyPassword, generateToken } = require('./middleware/auth');
const { validateBody } = require('./middleware/validation');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 8081;

// Disable X-Powered-By header
app.disable('x-powered-by');

// Global Middlewares
app.use(morgan('combined'));
app.use(helmet({
  contentSecurityPolicy: false, // Allows admin dashboard assets to load properly
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(hpp());

// Secure CORS config
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow servers / local scripts
    if (
      allowedOrigins.length === 0 || 
      allowedOrigins.includes(origin) || 
      origin.startsWith('http://localhost') || 
      origin.startsWith('http://127.0.0.1')
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Body Parsing with safe size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Static files config
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Redirect root to login
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Rate Limiters
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
    errorCode: 'RATE_LIMIT_EXCEEDED'
  }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
    errorCode: 'LOGIN_RATE_LIMIT_EXCEEDED'
  }
});

app.use('/api/', apiLimiter);

// Multer Image Upload Security Setup
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];

const fileFilter = (req, file, cb) => {
  const fileExt = path.extname(file.originalname).toLowerCase();
  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPG, JPEG, PNG, WEBP, GIF, SVG) are allowed!'));
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter
});

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// ===== AUTHENTICATION =====
app.post('/api/login', loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const adminEmail = process.env.ADMIN_LOGIN_EMAIL || 'admin@cloud.in';
    const adminPass = process.env.ADMIN_LOGIN_PASSWORD || 'admin2107';
    
    const emailMatches = email === adminEmail;
    const passwordMatches = await verifyPassword(password, adminPass);

    if (emailMatches && passwordMatches) {
      const token = generateToken(email);
      res.json({ success: true, token });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password.', 
        errorCode: 'INVALID_CREDENTIALS' 
      });
    }
  } catch (err) {
    next(err);
  }
});

// ===== WORKS API =====
app.get('/api/works', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('works')
      .select('*')
      .order('priority', { ascending: true });
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

app.post('/api/works', requireAdmin, upload.single('thumbnail'), validateBody('works'), async (req, res, next) => {
  let coverImage = null;
  try {
    coverImage = '/placeholder.svg';
    if (req.file) {
      coverImage = await uploadToSupabase(req.file);
    }

    const { data: works, error: priorityErr } = await supabase
      .from('works')
      .select('priority');
    
    if (priorityErr) throw priorityErr;
    const maxPriority = works.length > 0 ? Math.max(...works.map(w => w.priority || 0)) : 0;

    const crypto = require('crypto');
    const newWork = {
      id: crypto.randomUUID(),
      name: req.body.name,
      tag: req.body.tag,
      desc: req.body.desc,
      url: req.body.url,
      coverImage,
      priority: maxPriority + 1
    };

    const { error: insertErr } = await supabase
      .from('works')
      .insert(newWork);

    if (insertErr) throw insertErr;
    res.json({ success: true, work: newWork });
  } catch (err) {
    if (coverImage && coverImage !== '/placeholder.svg') {
      await deleteFromSupabase(coverImage);
    }
    next(err);
  }
});

app.put('/api/works/:id', requireAdmin, upload.single('thumbnail'), validateBody('works'), async (req, res, next) => {
  let uploadedImage = null;
  try {
    const { id } = req.params;
    
    const { data: current, error: fetchErr } = await supabase
      .from('works')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (fetchErr || !current) {
      return res.status(404).json({ success: false, message: 'Work not found', errorCode: 'NOT_FOUND' });
    }

    let coverImage = current.coverImage;
    if (req.file) {
      uploadedImage = await uploadToSupabase(req.file);
      coverImage = uploadedImage;
    }

    const updated = {
      name: req.body.name,
      tag: req.body.tag,
      desc: req.body.desc,
      url: req.body.url,
      coverImage
    };

    const { error: updateErr } = await supabase
      .from('works')
      .update(updated)
      .eq('id', id);

    if (updateErr) throw updateErr;

    // Delete old image if new image was successfully updated in DB
    if (uploadedImage && current.coverImage && current.coverImage.startsWith('http')) {
      await deleteFromSupabase(current.coverImage);
    }

    res.json({ success: true, work: { id, ...updated } });
  } catch (err) {
    if (uploadedImage) {
      await deleteFromSupabase(uploadedImage);
    }
    next(err);
  }
});

// Form Data parsing for priority update (uses upload.none() since no file is sent)
app.put('/api/works/:id/priority', requireAdmin, upload.none(), async (req, res, next) => {
  try {
    const { id } = req.params;
    const priority = parseInt(req.body.priority, 10) || 999;

    const { error } = await supabase
      .from('works')
      .update({ priority })
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

app.delete('/api/works/:id', requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: current, error: fetchErr } = await supabase
      .from('works')
      .select('coverImage')
      .eq('id', id)
      .maybeSingle();

    const { error } = await supabase
      .from('works')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Delete storage file if database delete succeeded
    if (current && current.coverImage && current.coverImage.startsWith('http')) {
      await deleteFromSupabase(current.coverImage);
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ===== CLIENTS API =====
app.get('/api/clients', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

app.post('/api/clients', requireAdmin, upload.single('photo'), validateBody('clients'), async (req, res, next) => {
  let photo = null;
  try {
    photo = '/placeholder.svg';
    if (req.file) {
      photo = await uploadToSupabase(req.file);
    }

    const crypto = require('crypto');
    const newClient = {
      id: crypto.randomUUID(),
      name: req.body.name,
      role: req.body.role,
      text: req.body.text,
      rating: req.body.rating,
      photo
    };

    const { error } = await supabase
      .from('clients')
      .insert(newClient);

    if (error) throw error;
    res.json({ success: true, client: newClient });
  } catch (err) {
    if (photo && photo !== '/placeholder.svg') {
      await deleteFromSupabase(photo);
    }
    next(err);
  }
});

app.put('/api/clients/:id', requireAdmin, upload.single('photo'), validateBody('clients'), async (req, res, next) => {
  let uploadedImage = null;
  try {
    const { id } = req.params;

    const { data: current, error: fetchErr } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (fetchErr || !current) {
      return res.status(404).json({ success: false, message: 'Client not found', errorCode: 'NOT_FOUND' });
    }

    let photo = current.photo;
    if (req.file) {
      uploadedImage = await uploadToSupabase(req.file);
      photo = uploadedImage;
    }

    const updated = {
      name: req.body.name,
      role: req.body.role,
      text: req.body.text,
      rating: req.body.rating,
      photo
    };

    const { error } = await supabase
      .from('clients')
      .update(updated)
      .eq('id', id);

    if (error) throw error;

    // Delete old image
    if (uploadedImage && current.photo && current.photo.startsWith('http')) {
      await deleteFromSupabase(current.photo);
    }

    res.json({ success: true, client: { id, ...updated } });
  } catch (err) {
    if (uploadedImage) {
      await deleteFromSupabase(uploadedImage);
    }
    next(err);
  }
});

app.delete('/api/clients/:id', requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: current, error: fetchErr } = await supabase
      .from('clients')
      .select('photo')
      .eq('id', id)
      .maybeSingle();

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;

    if (current && current.photo && current.photo.startsWith('http')) {
      await deleteFromSupabase(current.photo);
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ===== VIDEOS API =====
app.get('/api/videos', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

app.post('/api/videos', requireAdmin, upload.single('thumbnail'), validateBody('videos'), async (req, res, next) => {
  let thumbnail = null;
  try {
    thumbnail = '/placeholder.svg';
    if (req.file) {
      thumbnail = await uploadToSupabase(req.file);
    }

    const crypto = require('crypto');
    const newVideo = {
      id: crypto.randomUUID(),
      title: req.body.title,
      type: req.body.type,
      videoUrl: req.body.videoUrl,
      thumbnail
    };

    const { error } = await supabase
      .from('videos')
      .insert(newVideo);

    if (error) throw error;
    res.json({ success: true, video: newVideo });
  } catch (err) {
    if (thumbnail && thumbnail !== '/placeholder.svg') {
      await deleteFromSupabase(thumbnail);
    }
    next(err);
  }
});

app.put('/api/videos/:id', requireAdmin, upload.single('thumbnail'), validateBody('videos'), async (req, res, next) => {
  let uploadedImage = null;
  try {
    const { id } = req.params;

    const { data: current, error: fetchErr } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (fetchErr || !current) {
      return res.status(404).json({ success: false, message: 'Video not found', errorCode: 'NOT_FOUND' });
    }

    let thumbnail = current.thumbnail;
    if (req.file) {
      uploadedImage = await uploadToSupabase(req.file);
      thumbnail = uploadedImage;
    }

    const updated = {
      title: req.body.title,
      type: req.body.type,
      videoUrl: req.body.videoUrl,
      thumbnail
    };

    const { error } = await supabase
      .from('videos')
      .update(updated)
      .eq('id', id);

    if (error) throw error;

    if (uploadedImage && current.thumbnail && current.thumbnail.startsWith('http')) {
      await deleteFromSupabase(current.thumbnail);
    }

    res.json({ success: true, video: { id, ...updated } });
  } catch (err) {
    if (uploadedImage) {
      await deleteFromSupabase(uploadedImage);
    }
    next(err);
  }
});

app.delete('/api/videos/:id', requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: current, error: fetchErr } = await supabase
      .from('videos')
      .select('thumbnail')
      .eq('id', id)
      .maybeSingle();

    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    if (current && current.thumbnail && current.thumbnail.startsWith('http')) {
      await deleteFromSupabase(current.thumbnail);
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ===== CONTACT FORM EMAIL API =====
app.post('/api/contact', validateBody('contact'), async (req, res, next) => {
  const { name, email, phone, service, message } = req.body;
  
  try {
    const timestamp = new Date().toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'short'
    });

    // Email 1: To Admin
    const adminEmail = {
      from: process.env.GMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `🔔 New Lead — ${name} | ${service}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">New Lead from Cloud Build Website</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          </div>

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Project Details</h3>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Message:</strong><br>${message || 'No message provided'}</p>
          </div>

          <p style="color: #64748b; font-size: 14px;">Submitted at: ${timestamp}</p>

          ${phone ? `
          <div style="margin: 30px 0;">
            <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" 
               style="display: inline-block; background: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              💬 Open WhatsApp
            </a>
          </div>
          ` : ''}

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          <p style="color: #64748b; font-size: 12px;">Cloud Build Website - Admin Notification</p>
        </div>
      `
    };

    // Email 2: Auto-reply to User
    const firstName = name.split(' ')[0];
    const userEmail = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'We received your message — Cloud Build 🚀',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Hi ${firstName},</h2>
          
          <p>Thank you for reaching out to CloudBuild! 🙏</p>
          
          <p>We've received your message and our team will contact you very soon to discuss your business needs.</p>

          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="margin-top: 0; color: #1e40af;">Want to connect faster?</h3>
            <a href="${process.env.WHATSAPP_LINK}" 
               style="display: inline-block; background: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">
              💬 Chat on WhatsApp →
            </a>
          </div>

          <p style="font-size: 18px; color: #3b82f6; font-weight: bold;">Let's grow your business together 🚀</p>
          <p>We're excited to turn your vision into digital reality!</p>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

          <div style="color: #64748b; font-size: 14px;">
            <p style="margin: 5px 0;"><strong>Best regards,</strong></p>
            <p style="margin: 5px 0;">CloudBuild Team</p>
            <p style="margin: 5px 0;"><strong>CloudBuild</strong></p>
            <p style="margin: 5px 0;">📞 +91 7709646107</p>
            <p style="margin: 5px 0;">📍 Pune, Maharashtra, India</p>
            <p style="margin: 5px 0;">📸 @cloud_build_</p>
          </div>
        </div>
      `
    };

    // Send both emails
    await transporter.sendMail(adminEmail);
    await transporter.sendMail(userEmail);

    res.json({ success: true, message: 'Emails sent successfully' });
  } catch (error) {
    next(error);
  }
});

// ===== SETTINGS API =====
app.get('/api/settings', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('data')
      .eq('id', 'global')
      .maybeSingle();

    if (error || !data) {
      return res.json({});
    }
    res.json(data.data || {});
  } catch (err) {
    next(err);
  }
});

app.put('/api/settings', requireAdmin, validateBody('settings'), async (req, res, next) => {
  try {
    const { data: current, error: fetchErr } = await supabase
      .from('settings')
      .select('data')
      .eq('id', 'global')
      .maybeSingle();

    const existing = current ? current.data : {};
    const updated = {
      ...existing,
      ...req.body
    };

    const { error } = await supabase
      .from('settings')
      .upsert({ id: 'global', data: updated });

    if (error) throw error;
    res.json({ success: true, settings: updated });
  } catch (err) {
    next(err);
  }
});

// ===== FAQS API =====
app.get('/api/faqs', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

app.post('/api/faqs', requireAdmin, validateBody('faqs'), async (req, res, next) => {
  try {
    const crypto = require('crypto');
    const newFaq = {
      id: crypto.randomUUID(),
      q: req.body.q,
      a: req.body.a
    };

    const { error } = await supabase
      .from('faqs')
      .insert(newFaq);

    if (error) throw error;
    res.json({ success: true, faq: newFaq });
  } catch (err) {
    next(err);
  }
});

app.put('/api/faqs/:id', requireAdmin, validateBody('faqs'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = {
      q: req.body.q,
      a: req.body.a
    };

    const { error } = await supabase
      .from('faqs')
      .update(updated)
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, faq: { id, ...updated } });
  } catch (err) {
    next(err);
  }
});

app.delete('/api/faqs/:id', requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ===== BLOGS API =====
const https = require('https');

const parseMediumRSS = (xmlText) => {
  const items = [];
  const itemReg = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemReg.exec(xmlText)) !== null) {
    const content = match[1];
    const titleMatch = content.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
    const linkMatch = content.match(/<link>([\s\S]*?)<\/link>/);
    const dateMatch = content.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const descMatch = content.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/);
    
    let summary = "";
    if (descMatch) {
      summary = descMatch[1].replace(/<[^>]*>/g, '').replace(/[\r\n\t]+/g, ' ').trim().substring(0, 180) + '...';
    }
    
    const imgReg = /<img[^>]+src=["'](https:\/\/cdn-images-\d+\.medium\.com\/[\s\S]*?)["']/;
    const imgMatch = content.match(imgReg);
    const coverImage = imgMatch ? imgMatch[1] : '/placeholder.svg';
    
    const title = titleMatch ? titleMatch[1].trim() : 'Medium Article';
    const url = linkMatch ? linkMatch[1].trim() : 'https://medium.com/@cloudbuildtechnologies';
    const dateStr = dateMatch ? new Date(dateMatch[1].trim()).toLocaleDateString('en-US', {
      month: 'short', day: '2-digit', year: 'numeric'
    }) : '';
    
    const id = 'medium-' + Math.random().toString(36).substring(2, 9);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    items.push({
      id,
      slug,
      title,
      summary,
      url,
      coverImage,
      publishedDate: dateStr,
      category: "Insights",
      published: true,
      isMedium: true
    });
  }
  return items;
};

const fetchMediumBlogs = () => {
  return new Promise((resolve) => {
    https.get('https://medium.com/feed/@cloudbuildtechnologies', (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const items = parseMediumRSS(data);
          resolve(items);
        } catch (e) {
          console.error('Error parsing Medium RSS:', e);
          resolve([]);
        }
      });
    }).on('error', (e) => {
      console.error('Error fetching Medium RSS:', e);
      resolve([]);
    });
  });
};

app.get('/api/blogs', async (req, res, next) => {
  let localBlogs = [];
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    localBlogs = data || [];
  } catch (err) {
    console.error('Error fetching blogs from Supabase:', err.message);
  }

  try {
    const mediumBlogs = await fetchMediumBlogs();
    const merged = [...localBlogs, ...mediumBlogs];
    res.json(merged);
  } catch (err) {
    res.json(localBlogs);
  }
});

app.post('/api/blogs', requireAdmin, upload.single('coverImage'), validateBody('blogs'), async (req, res, next) => {
  let coverImage = null;
  try {
    const title = req.body.title;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    coverImage = '/placeholder.svg';
    if (req.file) {
      coverImage = await uploadToSupabase(req.file);
    }

    const crypto = require('crypto');
    const newBlog = {
      id: crypto.randomUUID(),
      slug,
      title,
      summary: req.body.summary,
      content: req.body.content,
      category: req.body.category || 'Insights',
      coverImage,
      publishedDate: new Date().toLocaleDateString('en-US', {
        month: 'short', day: '2-digit', year: 'numeric'
      }),
      published: req.body.published || false
    };

    const { error } = await supabase
      .from('blogs')
      .insert(newBlog);

    if (error) throw error;
    res.json({ success: true, blog: newBlog });
  } catch (err) {
    if (coverImage && coverImage !== '/placeholder.svg') {
      await deleteFromSupabase(coverImage);
    }
    next(err);
  }
});

app.put('/api/blogs/:id', requireAdmin, upload.single('coverImage'), validateBody('blogs'), async (req, res, next) => {
  let uploadedImage = null;
  try {
    const { id } = req.params;

    const { data: current, error: fetchErr } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (fetchErr || !current) {
      return res.status(404).json({ success: false, message: 'Blog not found', errorCode: 'NOT_FOUND' });
    }

    const title = req.body.title || current.title;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    let coverImage = current.coverImage;
    if (req.file) {
      uploadedImage = await uploadToSupabase(req.file);
      coverImage = uploadedImage;
    }

    const updated = {
      title,
      slug,
      summary: req.body.summary || current.summary,
      content: req.body.content || current.content,
      category: req.body.category || current.category,
      coverImage,
      published: req.body.published || false
    };

    const { error } = await supabase
      .from('blogs')
      .update(updated)
      .eq('id', id);

    if (error) throw error;

    if (uploadedImage && current.coverImage && current.coverImage.startsWith('http')) {
      await deleteFromSupabase(current.coverImage);
    }

    res.json({ success: true, blog: { id, ...updated } });
  } catch (err) {
    if (uploadedImage) {
      await deleteFromSupabase(uploadedImage);
    }
    next(err);
  }
});

app.delete('/api/blogs/:id', requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: current, error: fetchErr } = await supabase
      .from('blogs')
      .select('coverImage')
      .eq('id', id)
      .maybeSingle();

    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) throw error;

    if (current && current.coverImage && current.coverImage.startsWith('http')) {
      await deleteFromSupabase(current.coverImage);
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Global Error Handler Middleware (placed after routes)
app.use(errorHandler);

// Start server with performance timeout
const server = app.listen(PORT, () => {
  console.log(`Cloud Build Admin running on port ${PORT}`);
});
server.setTimeout(15000); // 15 seconds request timeout

// Graceful Shutdown Hook
const shutdown = () => {
  console.log('Stopping server gracefully...');
  server.close(() => {
    console.log('Process terminated.');
    process.exit(0);
  });
  // Force exit after 5 seconds if connection close hangs
  setTimeout(() => process.exit(1), 5000);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
