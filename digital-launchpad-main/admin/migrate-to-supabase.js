const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper to upload a local file to Supabase Storage
async function uploadFileToSupabase(localPath) {
  const fileName = path.basename(localPath);
  const fileBuffer = fs.readFileSync(localPath);
  
  // Determine content type based on extension
  const ext = path.extname(fileName).toLowerCase();
  let contentType = 'image/jpeg';
  if (ext === '.png') contentType = 'image/png';
  else if (ext === '.svg') contentType = 'image/svg+xml';
  else if (ext === '.webp') contentType = 'image/webp';
  else if (ext === '.gif') contentType = 'image/gif';

  // Upload to bucket 'uploads'
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(fileName, fileBuffer, {
      contentType,
      upsert: true
    });

  if (error) {
    console.error(`  ❌ Failed to upload ${fileName}:`, error.message);
    return null;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('uploads')
    .getPublicUrl(fileName);

  console.log(`  🚀 Uploaded ${fileName} -> ${publicUrl}`);
  return publicUrl;
}

// Helper to resolve and upload asset path if it's local
async function resolveAsset(imagePath) {
  if (!imagePath || !imagePath.startsWith('/uploads/')) {
    return imagePath;
  }

  const localFilePath = path.join(__dirname, 'public', imagePath);
  if (fs.existsSync(localFilePath)) {
    const publicUrl = await uploadFileToSupabase(localFilePath);
    return publicUrl || imagePath;
  }
  
  return imagePath;
}

// Migrate function
async function migrate() {
  console.log('🔄 Starting migration to Supabase...');

  // 1. Migrate Settings
  console.log('\n⚙️ Migrating Settings...');
  try {
    const settingsPath = path.join(__dirname, 'data', 'settings.json');
    if (fs.existsSync(settingsPath)) {
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      // Since settings is a single object, we save it under ID 'global'
      const { error } = await supabase
        .from('settings')
        .upsert({ id: 'global', data: settings });

      if (error) throw error;
      console.log('✅ Settings migrated successfully');
    } else {
      console.log('ℹ️ No settings.json found');
    }
  } catch (err) {
    console.error('❌ Failed migrating settings:', err.message);
  }

  // 2. Migrate FAQS
  console.log('\n❓ Migrating FAQs...');
  try {
    const faqsPath = path.join(__dirname, 'data', 'faqs.json');
    if (fs.existsSync(faqsPath)) {
      const faqs = JSON.parse(fs.readFileSync(faqsPath, 'utf8'));
      for (const faq of faqs) {
        const { error } = await supabase
          .from('faqs')
          .upsert({
            id: faq.id,
            q: faq.q,
            a: faq.a
          });
        if (error) console.error(`  ❌ Failed for FAQ ${faq.id}:`, error.message);
      }
      console.log(`✅ FAQs migrated. Total: ${faqs.length}`);
    }
  } catch (err) {
    console.error('❌ Failed migrating FAQs:', err.message);
  }

  // 3. Migrate Videos
  console.log('\n🎥 Migrating Videos...');
  try {
    const videosPath = path.join(__dirname, 'data', 'videos.json');
    if (fs.existsSync(videosPath)) {
      const videos = JSON.parse(fs.readFileSync(videosPath, 'utf8'));
      for (const video of videos) {
        const thumbnail = await resolveAsset(video.thumbnail);
        const { error } = await supabase
          .from('videos')
          .upsert({
            id: video.id,
            title: video.title,
            type: video.type,
            videoUrl: video.videoUrl,
            thumbnail
          });
        if (error) console.error(`  ❌ Failed for Video ${video.id}:`, error.message);
      }
      console.log(`✅ Videos migrated. Total: ${videos.length}`);
    }
  } catch (err) {
    console.error('❌ Failed migrating Videos:', err.message);
  }

  // 4. Migrate Clients (Testimonials)
  console.log('\n👥 Migrating Clients (Testimonials)...');
  try {
    const clientsPath = path.join(__dirname, 'data', 'clients.json');
    if (fs.existsSync(clientsPath)) {
      const clients = JSON.parse(fs.readFileSync(clientsPath, 'utf8'));
      for (const client of clients) {
        const photo = await resolveAsset(client.photo);
        const { error } = await supabase
          .from('clients')
          .upsert({
            id: client.id,
            name: client.name,
            role: client.role,
            text: client.text,
            rating: client.rating,
            photo
          });
        if (error) console.error(`  ❌ Failed for Client ${client.id}:`, error.message);
      }
      console.log(`✅ Clients migrated. Total: ${clients.length}`);
    }
  } catch (err) {
    console.error('❌ Failed migrating Clients:', err.message);
  }

  // 5. Migrate Works (Projects)
  console.log('\n💼 Migrating Works (Projects)...');
  try {
    const worksPath = path.join(__dirname, 'data', 'works.json');
    if (fs.existsSync(worksPath)) {
      const works = JSON.parse(fs.readFileSync(worksPath, 'utf8'));
      for (const work of works) {
        const coverImage = await resolveAsset(work.coverImage);
        const { error } = await supabase
          .from('works')
          .upsert({
            id: work.id,
            name: work.name,
            tag: work.tag,
            desc: work.desc,
            url: work.url,
            coverImage,
            priority: work.priority || 0
          });
        if (error) console.error(`  ❌ Failed for Work ${work.id}:`, error.message);
      }
      console.log(`✅ Works migrated. Total: ${works.length}`);
    }
  } catch (err) {
    console.error('❌ Failed migrating Works:', err.message);
  }

  // 6. Migrate Blogs
  console.log('\n📝 Migrating Blogs...');
  try {
    const blogsPath = path.join(__dirname, 'data', 'blogs.json');
    if (fs.existsSync(blogsPath)) {
      const blogs = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));
      for (const blog of blogs) {
        const coverImage = await resolveAsset(blog.coverImage);
        const { error } = await supabase
          .from('blogs')
          .upsert({
            id: blog.id,
            slug: blog.slug,
            title: blog.title,
            summary: blog.summary,
            content: blog.content,
            category: blog.category || 'Insights',
            coverImage,
            publishedDate: blog.publishedDate,
            published: blog.published || false
          });
        if (error) console.error(`  ❌ Failed for Blog ${blog.id}:`, error.message);
      }
      console.log(`✅ Blogs migrated. Total: ${blogs.length}`);
    }
  } catch (err) {
    console.error('❌ Failed migrating Blogs:', err.message);
  }

  console.log('\n🎉 Migration completed!');
}

migrate();
