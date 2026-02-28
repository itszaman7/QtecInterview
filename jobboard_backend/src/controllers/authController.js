const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Generate JWT and set it as an httpOnly cookie.
 */
const sendTokenCookie = (admin, statusCode, res) => {
  const token = jwt.sign(
    { id: admin.id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  };

  res.cookie('token', token, cookieOptions);

  res.status(statusCode).json({
    success: true,
    data: admin,
  });
};

/**
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find admin and include password field
    const admin = await Admin.findOne({ where: { email } });

    if (!admin || !(await admin.validatePassword(password))) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    sendTokenCookie(admin, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 */
exports.logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  res.json({ success: true, message: 'Logged out successfully' });
};

/**
 * GET /api/auth/me  (protected)
 */
exports.getMe = async (req, res) => {
  res.json({ success: true, data: req.admin });
};
