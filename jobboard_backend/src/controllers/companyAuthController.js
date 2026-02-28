const jwt = require('jsonwebtoken');
const Company = require('../models/Company');

const sendCompanyCookie = (company, statusCode, res) => {
  const token = jwt.sign(
    { id: company.id, email: company.email, role: 'company' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.cookie('company_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });

  res.status(statusCode).json({ success: true, data: company });
};

/** POST /api/company/register */
exports.register = async (req, res, next) => {
  try {
    const existing = await Company.findOne({ where: { email: req.body.email } });
    if (existing) {
      return res.status(409).json({ success: false, error: 'Email already registered' });
    }

    const company = await Company.create(req.body);
    sendCompanyCookie(company, 201, res);
  } catch (error) {
    next(error);
  }
};

/** POST /api/company/login */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const company = await Company.findOne({ where: { email } });

    if (!company || !(await company.validatePassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    sendCompanyCookie(company, 200, res);
  } catch (error) {
    next(error);
  }
};

/** POST /api/company/logout */
exports.logout = (req, res) => {
  res.cookie('company_token', '', { httpOnly: true, expires: new Date(0), path: '/' });
  res.json({ success: true, message: 'Logged out successfully' });
};

/** GET /api/company/me */
exports.getMe = async (req, res) => {
  res.json({ success: true, data: req.company });
};

/** PUT /api/company/profile */
exports.updateProfile = async (req, res, next) => {
  try {
    const company = await Company.findByPk(req.company.id);
    if (!company) {
      return res.status(404).json({ success: false, error: 'Company not found' });
    }

    await company.update({
      logo_url: req.body.logo_url || company.logo_url,
      description: req.body.description || company.description,
      website: req.body.website || company.website,
      location: req.body.location || company.location,
    });

    res.json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
};
