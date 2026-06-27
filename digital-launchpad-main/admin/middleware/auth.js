const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '24h';

/**
 * Verifies a plain-text password against a hashed or plain-text stored password.
 * Supports both bcrypt hashes and plain-text fallbacks for backward compatibility.
 * @param {string} plainPassword 
 * @param {string} hashedOrPlain 
 * @returns {Promise<boolean>}
 */
async function verifyPassword(plainPassword, hashedOrPlain) {
  if (hashedOrPlain.startsWith('$2a$') || hashedOrPlain.startsWith('$2b$')) {
    return await bcrypt.compare(plainPassword, hashedOrPlain);
  }
  return plainPassword === hashedOrPlain;
}

/**
 * Generates a signed JWT token for the admin email.
 * @param {string} email 
 * @returns {string} JWT Token
 */
function generateToken(email) {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Authentication middleware for write endpoints (POST, PUT, DELETE).
 */
function requireAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No authentication token provided.',
      errorCode: 'UNAUTHORIZED'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return res.status(401).json({ 
      success: false, 
      message: 'Format is Authorization: Bearer <token>',
      errorCode: 'INVALID_HEADER_FORMAT'
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ 
      success: false, 
      message: 'Session expired or invalid token. Please log in again.',
      errorCode: 'INVALID_TOKEN'
    });
  }
}

module.exports = {
  verifyPassword,
  generateToken,
  requireAdmin
};
