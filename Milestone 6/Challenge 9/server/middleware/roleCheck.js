
const roleCheck = (roles) => {
  return (req, res, next) => {
    // FIXED: Verify role exists in JWT and check against allowed roles
    if(!req.user?.role) {
      return res.status(401).json({ error: 'User role not found in token' });
    }
    
    if(!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Permission denied', requiredRoles: roles, userRole: req.user.role });
    }
    next();
  };
};

module.exports = roleCheck;
