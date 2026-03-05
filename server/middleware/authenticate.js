const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'inco-tech-secret-key';

/**
 * Verify JWT token from Authorization header.
 * Sets req.user = { id, username, role } on success.
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
}

/**
 * Require admin role. Must be used after verifyToken.
 */
function requireAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Forbidden. Admin access required.' });
}

module.exports = { verifyToken, requireAdmin };
