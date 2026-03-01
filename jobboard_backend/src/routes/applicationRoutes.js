const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { userAuth } = require('../middleware/userAuth');
const validate = require('../middleware/validate');
const { createApplicationSchema } = require('../middleware/schemas');

// Requires User Auth to apply
router.post('/', userAuth, validate(createApplicationSchema), applicationController.createApplication);
router.get('/', userAuth, applicationController.getMyApplications);
router.delete('/:id', userAuth, applicationController.cancelApplication);

module.exports = router;
