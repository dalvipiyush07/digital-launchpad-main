const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Uploads a file buffer to Supabase Storage uploads bucket.
 * @param {Object} file - Multer file object
 * @returns {Promise<string>} - Public URL of the uploaded image
 */
async function uploadToSupabase(file) {
  if (!file) return null;
  
  // Create a safe, unique filename using crypto UUID
  const crypto = require('crypto');
  const uniqueId = crypto.randomUUID();
  const fileExt = path.extname(file.originalname).toLowerCase();
  const fileName = `${uniqueId}${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: true
    });

  if (error) {
    console.error(`❌ Supabase storage upload failed:`, error.message);
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('uploads')
    .getPublicUrl(fileName);

  console.log(`🚀 File uploaded to Supabase Storage: ${publicUrl}`);
  return publicUrl;
}

/**
 * Deletes a file from Supabase Storage by its public URL.
 * @param {string} publicUrl - Public URL of the file to delete
 * @returns {Promise<void>}
 */
async function deleteFromSupabase(publicUrl) {
  if (!publicUrl || publicUrl === '/placeholder.svg') return;

  try {
    // Extract filename from URL (looks like /storage/v1/object/public/uploads/filename)
    const urlParts = publicUrl.split('/uploads/');
    if (urlParts.length < 2) return;
    
    const fileName = urlParts[1];
    const { error } = await supabase.storage
      .from('uploads')
      .remove([fileName]);

    if (error) {
      console.error(`⚠️ Failed to clean up file ${fileName} from Supabase Storage:`, error.message);
    } else {
      console.log(`🗑️ Cleaned up orphan storage file: ${fileName}`);
    }
  } catch (err) {
    console.error('⚠️ Storage cleanup error:', err.message);
  }
}

module.exports = {
  supabase,
  uploadToSupabase,
  deleteFromSupabase
};
