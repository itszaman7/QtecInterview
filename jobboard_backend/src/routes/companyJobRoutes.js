const express = require('express');
const router = express.Router();
const companyJobController = require('../controllers/companyJobController');
const { companyAuth, requireVerified } = require('../middleware/companyAuth');
const validate = require('../middleware/validate');
const { companyCreateJobSchema, companyUpdateJobSchema } = require('../middleware/schemas');

// All routes require company auth
router.use(companyAuth);

router.get('/', companyJobController.listOwnJobs);
router.get('/:id', companyJobController.getOwnJob);

// These also require verified status
router.post('/', requireVerified, validate(companyCreateJobSchema), companyJobController.createJob);
router.put('/:id', requireVerified, validate(companyUpdateJobSchema), companyJobController.updateJob);
router.delete('/:id', requireVerified, companyJobController.deleteJob);

// Applicant management
const { updateApplicationStatusSchema } = require('../middleware/schemas');
router.put('/applications/:id/status', requireVerified, validate(updateApplicationStatusSchema), companyJobController.updateApplicationStatus);

module.exports = router;
