const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passwordResetController = require('../controllers/passwordResetController');

// Login route
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', authController.login);

// Logout route
router.get('/logout', authController.logout);


// Password reset request route
router.get('/password-reset', (req, res) => {
  res.render('PasswordResetRequest');
});

router.post('/password-reset', passwordResetController.requestPasswordReset);

// Password reset form route
router.get('/password-reset/:token', (req, res) => {
  const { token } = req.params;
  res.render('PasswordReset', { token });
});

router.post('/password-reset/:token', passwordResetController.resetPassword);



// Password reset with OTP request route
router.get('/password-reset-otp', (req, res) => {
  res.render('PasswordResetWithOTP');
});

router.post('/password-reset-req-otp', passwordResetController.requestPasswordResetWithOTP);
router.post('/password-reset-otp', passwordResetController.resetPasswordWithOTP);
module.exports = router;