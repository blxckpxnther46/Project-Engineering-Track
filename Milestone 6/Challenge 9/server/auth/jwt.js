
const jwt = require('jsonwebtoken');
require('dotenv').config();

// FIXED: Use environment variable for secret, validate on startup
const SECRET = process.env.JWT_SECRET || (() => {
  throw new Error('JWT_SECRET environment variable is not set');
})();

// FIXED: Add expiresIn to prevent infinite token validity
const signToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: '1h' });
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};

module.exports = { signToken, verifyToken, SECRET };
