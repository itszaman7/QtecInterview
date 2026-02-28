const { Op } = require('sequelize');
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

    // Only active jobs (or let's just show all for now, maybe add deadline check later)
    if (title) where.title = { [Op.like]: `%${title}%` };
    if (category) where.category = { [Op.like]: `%${category}%` };
    if (location) where.location = { [Op.like]: `%${location}%` };
    if (type) where.type = { [Op.like]: `%${type}%` };

    const jobs = await Job.findAll({ 
      where, 
      order: [['created_at', 'DESC']],
      include: [
        { model: Company, as: 'companyProfile', attributes: ['logo_url', 'description', 'website'] }
      ]
    });

    res.json({
      success: true,
      count: jobs.length,
      data: jobs,
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
        { model: Application, as: 'applications' },
        { model: Company, as: 'companyProfile', attributes: ['logo_url', 'description', 'website'] }
      ],
    });

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    res.json({ success: true, data: job });
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
