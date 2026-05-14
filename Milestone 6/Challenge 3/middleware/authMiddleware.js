const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // ✅ Fixed: Read from standard Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    // ✅ Fixed: Strip 'Bearer ' prefix
    const token = authHeader.substring(7);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        // ✅ Fixed: Send 401 response, never call next() on error
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};
