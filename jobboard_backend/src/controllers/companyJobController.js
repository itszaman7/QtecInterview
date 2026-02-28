const Job = require('../models/Job');
const Application = require('../models/Application');

/** GET /api/company/jobs — list own jobs */
exports.listOwnJobs = async (req, res, next) => {
  try {
    const jobs = await Job.findAll({
      where: { company_id: req.company.id },
      order: [['created_at', 'DESC']],
      include: [{ model: Application, as: 'applications', attributes: ['id'] }],
    });

    const data = jobs.map((j) => ({
      ...j.toJSON(),
      applicant_count: j.applications?.length || 0,
    }));

    res.json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

/** GET /api/company/jobs/:id — get own job detail with applicants */
exports.getOwnJob = async (req, res, next) => {
  try {
    const job = await Job.findOne({
      where: { id: req.params.id, company_id: req.company.id },
      include: [
        { 
          model: Application, 
          as: 'applications',
          include: [
            {
              model: require('../models/User'),
              as: 'user',
              attributes: ['id', 'name', 'email', 'avatar_url', 'cv_url']
            }
          ]
        }
      ],
      order: [[{ model: Application, as: 'applications' }, 'createdAt', 'DESC']],
    });

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found or not yours' });
    }

    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

/** POST /api/company/jobs — create job */
exports.createJob = async (req, res, next) => {
  try {
    const job = await Job.create({
      ...req.body,
      company_id: req.company.id,
      company: req.company.name,
    });

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

/** PUT /api/company/jobs/:id — update own job */
exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findOne({
      where: { id: req.params.id, company_id: req.company.id },
    });

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found or not yours' });
    }

    await job.update(req.body);
    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

/** DELETE /api/company/jobs/:id — delete own job */
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findOne({
      where: { id: req.params.id, company_id: req.company.id },
    });

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found or not yours' });
    }

    await Application.destroy({ where: { job_id: job.id } });
    await job.destroy();

    res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    next(error);
  }
};

/** PUT /api/company/applications/:id/status — Update applicant status */
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    // We must find the application and verify it belongs to this company
    const application = await Application.findOne({
      where: { id: req.params.id, company_id: req.company.id },
    });

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found or unauthorized' });
    }

    await application.update({ status });
    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};
