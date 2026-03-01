const jwt = require('jsonwebtoken');

/**
 * Optional User Authentication Middleware.
 * Decodes the user token if it exists, but does not block the request if it's missing.
 * Attaches decoded user info to req.user if found.
 */
const maybeUserAuth = (req, res, next) => {
  try {
    const token = req.cookies.user_token;

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role === 'user') {
      req.user = decoded;
    }
  } catch (error) {
    // Silent fail for invalid tokens in public routes
  }
  next();
};

module.exports = { maybeUserAuth };
