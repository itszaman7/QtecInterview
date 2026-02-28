const express = require('express');
const router = express.Router();
const companyAuthController = require('../controllers/companyAuthController');
const { companyAuth } = require('../middleware/companyAuth');
const validate = require('../middleware/validate');
const { registerCompanySchema, loginSchema, updateCompanyProfileSchema } = require('../middleware/schemas');

router.post('/register', validate(registerCompanySchema), companyAuthController.register);
router.post('/login', validate(loginSchema), companyAuthController.login);
router.post('/logout', companyAuthController.logout);
router.get('/me', companyAuth, companyAuthController.getMe);
router.put('/profile', companyAuth, validate(updateCompanyProfileSchema), companyAuthController.updateProfile);

module.exports = router;
