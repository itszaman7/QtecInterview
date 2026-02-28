const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { userAuth } = require('../middleware/userAuth');
const validate = require('../middleware/validate');
const { registerUserSchema, loginSchema, updateUserProfileSchema } = require('../middleware/schemas');

router.post('/register', validate(registerUserSchema), userController.register);
router.post('/login', validate(loginSchema), userController.login);
router.post('/logout', userController.logout);
router.get('/me', userAuth, userController.getMe);
router.put('/profile', userAuth, validate(updateUserProfileSchema), userController.updateProfile);

module.exports = router;
