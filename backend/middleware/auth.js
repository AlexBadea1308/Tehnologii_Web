import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

export const roleMiddleware = (roles) => (req, res, next) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    for (let i = 0; i < allowedRoles.length; i++) {
      const allowedRole = allowedRoles[i];
      if (req.user.role.toString() === allowedRole.toString()) {
         return next();
      }
    }
  
    return res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
  };