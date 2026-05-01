const rateLimit = require('express-rate-limit');

const bookingLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    error: 'Too many booking attempts. Please try again later.'
  }
});

module.exports = bookingLimiter;