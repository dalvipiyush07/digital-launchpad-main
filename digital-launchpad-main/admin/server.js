const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 8081;

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Redirect root to login
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Helper functions to read/write JSON files
const readJSON = (filename) => {
  const filePath = path.join(__dirname, 'data', filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const writeJSON = (filename, data) => {
  const filePath = path.join(__dirname, 'data', filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Authentication endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  const adminEmail = process.env.ADMIN_LOGIN_EMAIL || 'admin@cloud.in';
  const adminPass = process.env.ADMIN_LOGIN_PASSWORD || 'admin2107';
  if (email === adminEmail && password === adminPass) {
    res.json({ success: true, token: 'admin-token-' + Date.now() });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// ===== WORKS API =====
app.get('/api/works', (req, res) => {
  const works = readJSON('works.json');
  console.log('📦 GET /api/works - Returning', works.length, 'projects');
  res.json(works);
});

app.post('/api/works', upload.single('thumbnail'), (req, res) => {
  const works = readJSON('works.json');
  const maxPriority = works.length > 0 ? Math.max(...works.map(w => w.priority || 0)) : 0;
  const newWork = {
    id: Date.now().toString(),
    name: req.body.name,
    tag: req.body.tag,
    desc: req.body.desc,
    url: req.body.url,
    coverImage: req.file ? `/uploads/${req.file.filename}` : '/placeholder.svg',
    priority: maxPriority + 1
  };
  works.push(newWork);
  writeJSON('works.json', works);
  console.log('✅ POST /api/works - Added new project:', newWork.name);
  res.json({ success: true, work: newWork });
});

app.put('/api/works/:id', upload.single('thumbnail'), (req, res) => {
  const works = readJSON('works.json');
  const index = works.findIndex(w => w.id === req.params.id);
  
  if (index !== -1) {
    works[index] = {
      ...works[index],
      name: req.body.name,
      tag: req.body.tag,
      desc: req.body.desc,
      url: req.body.url,
      coverImage: req.file ? `/uploads/${req.file.filename}` : works[index].coverImage
    };
    writeJSON('works.json', works);
    res.json({ success: true, work: works[index] });
  } else {
    res.status(404).json({ success: false, message: 'Work not found' });
  }
});

app.put('/api/works/:id/priority', (req, res) => {
  const works = readJSON('works.json');
  const index = works.findIndex(w => w.id === req.params.id);
  
  if (index !== -1) {
    works[index].priority = parseInt(req.body.priority) || 999;
    writeJSON('works.json', works);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: 'Work not found' });
  }
});

app.delete('/api/works/:id', (req, res) => {
  let works = readJSON('works.json');
  works = works.filter(w => w.id !== req.params.id);
  writeJSON('works.json', works);
  res.json({ success: true });
});

// ===== CLIENTS API =====
app.get('/api/clients', (req, res) => {
  const clients = readJSON('clients.json');
  res.json(clients);
});

app.post('/api/clients', upload.single('photo'), (req, res) => {
  const clients = readJSON('clients.json');
  const newClient = {
    id: Date.now().toString(),
    name: req.body.name,
    role: req.body.role,
    text: req.body.text,
    rating: parseInt(req.body.rating) || 5,
    photo: req.file ? `/uploads/${req.file.filename}` : '/placeholder.svg'
  };
  clients.push(newClient);
  writeJSON('clients.json', clients);
  res.json({ success: true, client: newClient });
});

app.put('/api/clients/:id', upload.single('photo'), (req, res) => {
  const clients = readJSON('clients.json');
  const index = clients.findIndex(c => c.id === req.params.id);
  
  if (index !== -1) {
    clients[index] = {
      ...clients[index],
      name: req.body.name,
      role: req.body.role,
      text: req.body.text,
      rating: parseInt(req.body.rating) || 5,
      photo: req.file ? `/uploads/${req.file.filename}` : clients[index].photo
    };
    writeJSON('clients.json', clients);
    res.json({ success: true, client: clients[index] });
  } else {
    res.status(404).json({ success: false, message: 'Client not found' });
  }
});

app.delete('/api/clients/:id', (req, res) => {
  let clients = readJSON('clients.json');
  clients = clients.filter(c => c.id !== req.params.id);
  writeJSON('clients.json', clients);
  res.json({ success: true });
});

// ===== VIDEOS API =====
app.get('/api/videos', (req, res) => {
  const videos = readJSON('videos.json');
  res.json(videos);
});

app.post('/api/videos', upload.single('thumbnail'), (req, res) => {
  const videos = readJSON('videos.json');
  const newVideo = {
    id: Date.now().toString(),
    title: req.body.title,
    type: req.body.type,
    videoUrl: req.body.videoUrl,
    thumbnail: req.file ? `/uploads/${req.file.filename}` : '/placeholder.svg'
  };
  videos.push(newVideo);
  writeJSON('videos.json', videos);
  res.json({ success: true, video: newVideo });
});

app.put('/api/videos/:id', upload.single('thumbnail'), (req, res) => {
  const videos = readJSON('videos.json');
  const index = videos.findIndex(v => v.id === req.params.id);
  
  if (index !== -1) {
    videos[index] = {
      ...videos[index],
      title: req.body.title,
      type: req.body.type,
      videoUrl: req.body.videoUrl,
      thumbnail: req.file ? `/uploads/${req.file.filename}` : videos[index].thumbnail
    };
    writeJSON('videos.json', videos);
    res.json({ success: true, video: videos[index] });
  } else {
    res.status(404).json({ success: false, message: 'Video not found' });
  }
});

app.delete('/api/videos/:id', (req, res) => {
  let videos = readJSON('videos.json');
  videos = videos.filter(v => v.id !== req.params.id);
  writeJSON('videos.json', videos);
  res.json({ success: true });
});

// ===== CONTACT FORM EMAIL API =====
app.post('/api/contact', async (req, res) => {
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
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send emails' });
  }
});

// ===== SETTINGS API =====
app.get('/api/settings', (req, res) => {
  const settings = readJSON('settings.json');
  res.json(settings);
});

app.put('/api/settings', (req, res) => {
  const settings = readJSON('settings.json');
  const updatedSettings = {
    ...settings,
    ...req.body
  };
  writeJSON('settings.json', updatedSettings);
  res.json({ success: true, settings: updatedSettings });
});

// ===== FAQS API =====
app.get('/api/faqs', (req, res) => {
  const faqs = readJSON('faqs.json');
  res.json(faqs);
});

app.post('/api/faqs', (req, res) => {
  const faqs = readJSON('faqs.json');
  const newFaq = {
    id: Date.now().toString(),
    q: req.body.q,
    a: req.body.a
  };
  faqs.push(newFaq);
  writeJSON('faqs.json', faqs);
  res.json({ success: true, faq: newFaq });
});

app.put('/api/faqs/:id', (req, res) => {
  const faqs = readJSON('faqs.json');
  const index = faqs.findIndex(f => f.id === req.params.id);
  if (index !== -1) {
    faqs[index] = {
      ...faqs[index],
      q: req.body.q,
      a: req.body.a
    };
    writeJSON('faqs.json', faqs);
    res.json({ success: true, faq: faqs[index] });
  } else {
    res.status(404).json({ success: false, message: 'FAQ not found' });
  }
});

app.delete('/api/faqs/:id', (req, res) => {
  let faqs = readJSON('faqs.json');
  faqs = faqs.filter(f => f.id !== req.params.id);
  writeJSON('faqs.json', faqs);
  res.json({ success: true });
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

app.get('/api/blogs', async (req, res) => {
  const localBlogs = readJSON('blogs.json');
  try {
    const mediumBlogs = await fetchMediumBlogs();
    const merged = [...localBlogs, ...mediumBlogs];
    res.json(merged);
  } catch (err) {
    res.json(localBlogs);
  }
});

app.post('/api/blogs', upload.single('coverImage'), (req, res) => {
  const blogs = readJSON('blogs.json');
  const title = req.body.title;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  const newBlog = {
    id: Date.now().toString(),
    slug,
    title,
    summary: req.body.summary,
    content: req.body.content,
    category: req.body.category || 'Insights',
    coverImage: req.file ? `/uploads/${req.file.filename}` : '/placeholder.svg',
    publishedDate: new Date().toLocaleDateString('en-US', {
      month: 'short', day: '2-digit', year: 'numeric'
    }),
    published: req.body.published === 'true' || req.body.published === true
  };
  
  blogs.push(newBlog);
  writeJSON('blogs.json', blogs);
  res.json({ success: true, blog: newBlog });
});

app.put('/api/blogs/:id', upload.single('coverImage'), (req, res) => {
  const blogs = readJSON('blogs.json');
  const index = blogs.findIndex(b => b.id === req.params.id);
  
  if (index !== -1) {
    const title = req.body.title || blogs[index].title;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    blogs[index] = {
      ...blogs[index],
      title,
      slug,
      summary: req.body.summary || blogs[index].summary,
      content: req.body.content || blogs[index].content,
      category: req.body.category || blogs[index].category,
      coverImage: req.file ? `/uploads/${req.file.filename}` : blogs[index].coverImage,
      published: req.body.published === 'true' || req.body.published === true
    };
    
    writeJSON('blogs.json', blogs);
    res.json({ success: true, blog: blogs[index] });
  } else {
    res.status(404).json({ success: false, message: 'Blog not found' });
  }
});

app.delete('/api/blogs/:id', (req, res) => {
  let blogs = readJSON('blogs.json');
  blogs = blogs.filter(b => b.id !== req.params.id);
  writeJSON('blogs.json', blogs);
  res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`Cloud Build Admin running on port ${PORT}`);
});
