const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createJobSchema } = require('../middleware/schemas');

// Public
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);

// Protected (admin only)
router.post('/', auth, validate(createJobSchema), jobController.createJob);
router.delete('/:id', auth, jobController.deleteJob);

module.exports = router;
