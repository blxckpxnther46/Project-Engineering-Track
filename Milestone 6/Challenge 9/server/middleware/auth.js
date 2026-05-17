
const { verifyToken } = require('../auth/jwt');
const { blacklist } = require('../data/store');

const auth = (req, res, next) => {
  const token = req.headers['authorization'];
  if(!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const tokenValue = token.split(' ')[1];
    
    // FIXED: Check if token is blacklisted
    if(blacklist.includes(tokenValue)) {
      return res.status(401).json({ error: 'Token has been revoked' });
    }
    
    const decoded = verifyToken(tokenValue);
    // FIXED: Role now comes from JWT payload
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Auth failed' });
  }
};

module.exports = auth;
