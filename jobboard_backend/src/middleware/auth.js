const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * JWT cookie authentication middleware.
 * Reads the token from the `token` httpOnly cookie.
 */
const auth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please log in.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findByPk(decoded.id);

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Admin account no longer exists.',
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token. Please log in again.',
      });
    }
    next(error);
  }
};

module.exports = auth;
