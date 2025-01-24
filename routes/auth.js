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
router.get('/logout', (req, res) => {
  res.render('login');
});

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

module.exports = router;