const Company = require('../models/Company');
const Job = require('../models/Job');

/** GET /api/admin/companies — list all companies */
exports.listCompanies = async (req, res, next) => {
  try {
    const companies = await Company.findAll({
      order: [['created_at', 'DESC']],
      include: [{ model: Job, as: 'jobs', attributes: ['id'] }],
    });

    const data = companies.map((c) => ({
      ...c.toJSON(),
      job_count: c.jobs?.length || 0,
    }));

    res.json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

/** PATCH /api/admin/companies/:id/verify — toggle verification */
exports.verifyCompany = async (req, res, next) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, error: 'Company not found' });
    }

    company.is_verified = !company.is_verified;
    await company.save();

    res.json({
      success: true,
      message: company.is_verified ? 'Company verified' : 'Company verification revoked',
      data: company,
    });
  } catch (error) {
    next(error);
  }
};
