const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
  try {
    const token = req.cookies.user_token;

    if (!token) {
      return res.status(401).json({ success: false, error: 'Authentication failed: No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach decoded user info to request (should have id, email, role)
    if (decoded.role !== 'user') {
      return res.status(403).json({ success: false, error: 'Access denied: Must be an applicant user' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Authentication failed: Invalid or expired token' });
  }
};

module.exports = { userAuth };
