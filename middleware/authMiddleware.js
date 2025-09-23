const jwt = require('jsonwebtoken');

// Middleware to verify admin access using JWT
const verifyAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access Denied: Authorization header missing',
      });
    }

    // Extract token from Bearer schema if present
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access Denied: Token missing in Authorization header',
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // Attach user info to request
    next();

  } catch (err) {
    console.error('[JWT ERROR] Token verification failed:', err.message);

    return res.status(403).json({
      success: false,
      message: 'Access Denied: Invalid or expired token',
    });
  }
};

module.exports = verifyAdmin;
