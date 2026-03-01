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

/**
 * GET /api/applications
 * Get the current user's job applications (requires userAuth).
 */
exports.getMyApplications = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const applications = await Application.findAll({
      where: { user_id },
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'location', 'type', 'company_id']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/applications/:id
 * Cancel a job application (requires userAuth).
 */
exports.cancelApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const application = await Application.findOne({
      where: { id, user_id }
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    await application.destroy();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
