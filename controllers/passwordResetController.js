const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User'); // Adjust the path as necessary


exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
  
    if (!user) {
      return res.render('PasswordResetRequest', { errorMessage: 'No user associated with this email.' });
        }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Reset Your Password for Online Exam Portal',
      html: `
        <p>Hi ${user.name || 'User'},</p>
        <p>We received a request to reset the password for your account on the <strong> Online Exam Portal</strong>.</p>
        <p>If you made this request, click the link below to set a new password:</p>
        <a href="${process.env.PASSWORD_RESET_URL}/${token}" style="background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset My Password</a>
        <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
        <p><a href="${process.env.PASSWORD_RESET_URL}/${token}">${process.env.PASSWORD_RESET_URL}/${token}</a></p>
        <p>This link will expire in <strong>1 hour</strong>, so please reset your password before it expires. If you didn’t request a password reset, you can ignore this email—your account will remain secure.</p>
        <p>Thank you,</p>
        <p>The <strong>Online Exam Portal</strong> Team</p>
      `,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
      return res.render('PasswordResetRequest', { errorMessage: 'Error sending email.' });
      }
      return res.render('PasswordResetRequest', { message: 'password reset link has been sent.' });
    });
  };

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.render('PasswordReset', { errorMessage: 'password reset link has been expired!.',token:token });
    }

    user.password = password; // Make sure to hash the password before saving
    await user.save();
    return res.render('PasswordReset', { message: 'Your password has been reset successfully.',token:token });

  } catch (error) {
    return res.render('PasswordReset', { errorMessage: 'Error!, Try Again.',token:token });

  }
};