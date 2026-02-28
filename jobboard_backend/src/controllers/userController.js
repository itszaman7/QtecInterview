const jwt = require('jsonwebtoken');
const User = require('../models/User');

const sendUserCookie = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user.id, email: user.email, role: 'user' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.cookie('user_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });

  res.status(statusCode).json({ success: true, data: user });
};

/** POST /api/users/register */
exports.register = async (req, res, next) => {
  try {
    const existing = await User.findOne({ where: { email: req.body.email } });
    if (existing) {
      return res.status(409).json({ success: false, error: 'Email already registered' });
    }

    const user = await User.create(req.body);
    sendUserCookie(user, 201, res);
  } catch (error) {
    next(error);
  }
};

/** POST /api/users/login */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    sendUserCookie(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/** POST /api/users/logout */
exports.logout = (req, res) => {
  res.cookie('user_token', '', { httpOnly: true, expires: new Date(0), path: '/' });
  res.json({ success: true, message: 'Logged out successfully' });
};

/** GET /api/users/me */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

/** PUT /api/users/profile */
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    await user.update({
      avatar_url: req.body.avatar_url || user.avatar_url,
      cv_url: req.body.cv_url || user.cv_url,
      is_profile_complete: true,
    });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
