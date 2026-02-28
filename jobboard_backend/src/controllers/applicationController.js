const Application = require('../models/Application');
const Job = require('../models/Job');

/**
 * POST /api/applications
 * Submit a job application (requires userAuth).
 */
exports.createApplication = async (req, res, next) => {
  try {
    const { job_id } = req.body;
    const user_id = req.user.id; // From userAuth middleware

    // Verify job exists
    const job = await Job.findByPk(job_id);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: `Job with id ${job_id} not found`,
      });
    }

    // Check if already applied
    const existing = await Application.findOne({
      where: { job_id, user_id }
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'You have already applied to this job',
      });
    }

    const application = await Application.create({
      job_id,
      user_id,
      company_id: job.company_id, // Link directly to company
      status: 'pending'
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};
