const express = require('express');
const router = express.Router();
const adminCompanyController = require('../controllers/adminCompanyController');
const auth = require('../middleware/auth');

// All routes require admin auth
router.use(auth);

router.get('/', adminCompanyController.listCompanies);
router.patch('/:id/verify', adminCompanyController.verifyCompany);

module.exports = router;
