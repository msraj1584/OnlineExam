const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User'); // Adjust the path as necessary
const bcrypt = require('bcrypt');

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
      return res.render('PasswordReset', { errorMessage: 'password reset link has been expired!.', token: token });
    }

    user.password = password; // Make sure to hash the password before saving
    await user.save();
    return res.render('PasswordReset', { message: 'Your password has been reset successfully.', token: token });

  } catch (error) {
    return res.render('PasswordReset', { errorMessage: 'Error!, Try Again.', token: token });

  }
};

exports.requestPasswordResetWithOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'No user associated with this email.',
        showOTPForm: false,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit numeric OTP
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL,
      subject: 'Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
          <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>Hello ${user.name || 'User'},</p>
            <p>You requested to reset your password. Use the OTP below to complete the process:</p>
            <div style="background: #007bff; color: white; padding: 15px; text-align: center; font-size: 24px; border-radius: 5px; letter-spacing: 4px;">
              <strong>${otp}</strong>
            </div>
            <p style="margin-top: 20px;">This OTP is valid for 1 hour. If you didn’t request a password reset, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">If you have any questions, contact our support team.</p>
          </div>
        </div>
      `,
    };


    await transporter.sendMail(mailOptions);
    // Send response to frontend with message and flag for showing OTP form
    return res.json({
      success: true,
      message: 'OTP has been sent to your email.',
      showOTPForm: true, // Show OTP form if OTP was sent
    });

  } catch (error) {
    return res.status(500).json({
      success: false, message: 'Error sending OTP. Please try again.', showOTPForm: false,
    });
  }
};

exports.resetPasswordWithOTP = async (req, res) => {
  const { otp, password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() }, // Check if OTP is still valid
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'OTP is invalid or has expired! Try again.' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = password;

    // Clear OTP and expiration after successful reset
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error! Try again.' });
  }
};
