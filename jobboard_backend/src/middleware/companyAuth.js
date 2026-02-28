const jwt = require('jsonwebtoken');
const Company = require('../models/Company');

/**
 * Company JWT auth middleware.
 * Reads from `company_token` httpOnly cookie (separate from admin `token`).
 */
const companyAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.company_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please log in as a company.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'company') {
      return res.status(401).json({ success: false, error: 'Invalid token type.' });
    }

    const company = await Company.findByPk(decoded.id);

    if (!company) {
      return res.status(401).json({ success: false, error: 'Company no longer exists.' });
    }

    req.company = company;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
    }
    next(error);
  }
};

/**
 * Middleware that checks if the company is verified by admin.
 * Use AFTER companyAuth.
 */
const requireVerified = (req, res, next) => {
  if (!req.company.is_verified) {
    return res.status(403).json({
      success: false,
      error: 'Your company is not yet verified. Please wait for admin approval.',
    });
  }
  next();
};

module.exports = { companyAuth, requireVerified };
