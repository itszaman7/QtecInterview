const { Op, Sequelize } = require('sequelize');
const Job = require('../models/Job');
const Application = require('../models/Application');

const Company = require('../models/Company');

/**
 * GET /api/jobs
 * Fetch all jobs. Supports ?title=T&category=C&location=L&type=T query filters.
 */
exports.getAllJobs = async (req, res, next) => {
  try {
    const { title, category, location, type } = req.query;
    const where = {};

    // Use LOWER() for case-insensitive search in TiDB (utf8mb4_bin collation)
    if (title) where.title = Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Job.title')), 'LIKE', `%${title.toLowerCase()}%`);
    if (category) where.category = Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Job.category')), 'LIKE', `%${category.toLowerCase()}%`);
    if (location) where.location = Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Job.location')), 'LIKE', `%${location.toLowerCase()}%`);
    if (type) where.type = Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Job.type')), 'LIKE', `%${type.toLowerCase()}%`);

    const jobs = await Job.findAll({ 
      where, 
      order: [['created_at', 'DESC']],
      include: [
        { model: Company, as: 'companyProfile', attributes: ['name', 'logo_url', 'description', 'website'] }
      ]
    });

    let data = jobs.map(j => j.toJSON());

    // If user is logged in, check which jobs they applied to
    if (req.user) {
      const applications = await Application.findAll({
        where: { user_id: req.user.id },
        attributes: ['job_id']
      });
      const appliedJobIds = new Set(applications.map(a => a.job_id));
      data = data.map(job => ({
        ...job,
        is_applied: appliedJobIds.has(job.id)
      }));
    }

    res.json({
      success: true,
      count: jobs.length,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/jobs/:id
 * Fetch a single job with its applications.
 */
exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [
        { model: Company, as: 'companyProfile', attributes: ['name', 'logo_url', 'description', 'website'] }
      ],
    });

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    const jobData = job.toJSON();

    // Check if applied
    if (req.user) {
      const application = await Application.findOne({
        where: { job_id: job.id, user_id: req.user.id }
      });
      jobData.is_applied = !!application;
    }

    // Suggested jobs (same category or similar tags)
    const suggestedJobs = await Job.findAll({
      where: {
        category: job.category,
        id: { [Op.ne]: job.id }
      },
      limit: 6,
      include: [
        { model: Company, as: 'companyProfile', attributes: ['name', 'logo_url'] }
      ]
    });

    res.json({ 
      success: true, 
      data: jobData,
      suggested: suggestedJobs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/jobs  (protected)
 * Create a new job listing.
 */
exports.createJob = async (req, res, next) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/jobs/:id  (protected)
 * Remove a job listing and its associated applications (CASCADE).
 */
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    // Delete associated applications first, then the job
    await Application.destroy({ where: { job_id: job.id } });
    await job.destroy();

    res.json({ success: true, message: 'Job and associated applications deleted' });
  } catch (error) {
    next(error);
  }
};
