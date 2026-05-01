function validateUser(req, res, next) {
  const errors = [];
  let { username, email, password, age, role, website } = req.body;

  // R01 Presence
  if (!username || !email || !password || age === undefined || !role) {
    errors.push('All required fields must be provided');
  }

  // R02 Length
  if (username && (username.length < 3 || username.length > 30)) {
    errors.push('Username must be between 3 and 30 characters');
  }

  // R03 Email format
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Invalid email format');
  }

  // R04 Age type
  if (age !== undefined && typeof age !== 'number') {
    errors.push('Age must be a number');
  }

  // R05 Age limit
  if (typeof age === 'number' && age < 18) {
    errors.push('Age must be at least 18');
  }

  // R06 Role enum
  if (role && !['user', 'admin'].includes(role)) {
    errors.push('Role must be user or admin');
  }

  // R07 Website optional
  if (website && !/^https?:\/\/.+\..+/.test(website)) {
    errors.push('Invalid website URL');
  }

  // R10 Password complexity
  if (password && (!/[a-zA-Z]/.test(password) || !/\d/.test(password))) {
    errors.push('Password must contain at least one letter and one number');
  }

  // R08 + R09 Sanitization
  if (username) username = username.trim();
  if (email) email = email.trim().toLowerCase();

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  req.body = { username, email, password, age, role, website };
  next();
}

module.exports = validateUser;