const cors = require('cors');

// Regular Expressions for strict CORS matching
const localhostRegex = /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;
const cloudbuildRegex = /^https:\/\/(?:[a-zA-Z0-9-]+\.)*cloudbuild\.tech$/;

const corsOptions = {
  origin: (origin, callback) => {
    // 1. Allow requests with no origin (Postman, curl, health checks, cron jobs)
    if (!origin) {
      return callback(null, true);
    }

    // 2. Allow Local Development origins
    if (localhostRegex.test(origin)) {
      return callback(null, true);
    }

    // 3. Allow any secure subdomain ending with cloudbuild.tech
    if (cloudbuildRegex.test(origin)) {
      return callback(null, true);
    }

    // 4. Reject all other origins (e.g. evil.com, fake-cloudbuild.tech)
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = cors(corsOptions);
