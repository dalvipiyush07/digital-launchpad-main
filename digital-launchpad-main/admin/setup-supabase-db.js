const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required.');
  process.exit(1);
}

// Derive project ref from URL
const urlMatch = supabaseUrl.match(/https:\/\/([a-z0-9]+)\.supabase\.co/);
if (!urlMatch) {
  console.error('❌ Error: Invalid SUPABASE_URL format. Expected https://project-ref.supabase.co');
  process.exit(1);
}
const projectRef = urlMatch[1];

// Construct Direct PostgreSQL Connection String
const dbPassword = supabaseServiceKey; // Assuming service key or database password was provided
const connectionString = `postgres://postgres:${dbPassword}@db.${projectRef}.supabase.co:5432/postgres`;

console.log(`Connecting to PostgreSQL for project: ${projectRef}...`);

const sql = `
-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.works (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tag TEXT,
    "desc" TEXT,
    url TEXT,
    "coverImage" TEXT,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    text TEXT,
    rating INTEGER DEFAULT 5,
    photo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.videos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT,
    "videoUrl" TEXT,
    thumbnail TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.faqs (
    id TEXT PRIMARY KEY,
    q TEXT NOT NULL,
    a TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.blogs (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    category TEXT DEFAULT 'Insights',
    "coverImage" TEXT,
    "publishedDate" TEXT,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid duplication errors
DO $$
BEGIN
    DROP POLICY IF EXISTS "Allow public read access on works" ON public.works;
    DROP POLICY IF EXISTS "Allow public read access on clients" ON public.clients;
    DROP POLICY IF EXISTS "Allow public read access on videos" ON public.videos;
    DROP POLICY IF EXISTS "Allow public read access on faqs" ON public.faqs;
    DROP POLICY IF EXISTS "Allow public read access on blogs" ON public.blogs;
    DROP POLICY IF EXISTS "Allow public read access on settings" ON public.settings;
EXCEPTION
    WHEN others THEN NULL;
END $$;

-- Create Policies
CREATE POLICY "Allow public read access on works" ON public.works FOR SELECT USING (true);
CREATE POLICY "Allow public read access on clients" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Allow public read access on videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Allow public read access on faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Allow public read access on blogs" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Allow public read access on settings" ON public.settings FOR SELECT USING (true);
`;

async function run() {
  // A. Create Tables
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('⚡ Connected to PostgreSQL database successfully.');
    await client.query(sql);
    console.log('✅ All tables and policies created successfully.');
  } catch (err) {
    console.error('❌ Database migration SQL failed:', err.message);
    console.log('\n💡 Please check if the SUPABASE_SERVICE_ROLE_KEY is your database password. If not, edit the key in your .env file to be your database password.');
  } finally {
    await client.end();
  }

  // B. Create Storage Bucket
  console.log('\n📁 Creating Storage Bucket...');
  try {
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check if bucket exists
    const { data: buckets, error: getBucketsError } = await supabaseClient.storage.listBuckets();
    
    if (getBucketsError) {
      throw getBucketsError;
    }

    const bucketExists = buckets.some(b => b.name === 'uploads');
    if (!bucketExists) {
      const { error: createBucketError } = await supabaseClient.storage.createBucket('uploads', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      });

      if (createBucketError) {
        throw createBucketError;
      }
      console.log('✅ Bucket "uploads" created successfully with public access.');
    } else {
      console.log('ℹ️ Bucket "uploads" already exists.');
    }
  } catch (err) {
    console.error('❌ Failed to setup storage bucket:', err.message);
  }
}

run();
