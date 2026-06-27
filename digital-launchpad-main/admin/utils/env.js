function validateEnv() {
  const required = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'JWT_SECRET',
    'GMAIL_USER',
    'GMAIL_APP_PASSWORD',
    'ADMIN_EMAIL',
    'ADMIN_LOGIN_EMAIL',
    'ADMIN_LOGIN_PASSWORD'

  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Critical: Missing required environment variables:');
    missing.forEach(key => console.error(`  - ${key}`));
    console.error('\nPlease check your .env file or deployment settings.');
    process.exit(1);
  }
}

module.exports = { validateEnv };
