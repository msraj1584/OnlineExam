const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email, role });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign(
          { userId: user._id, email: user.email, role: user.role, name: user.name },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        // Save token in a cookie
        res.cookie('token', token, { httpOnly: true });

        // Redirect based on user role
        if (user.role === 'Student') {
          return res.redirect('/student/dashboard');
        } else if (user.role === 'Teacher') {
          return res.redirect('/teacher/dashboard');
        }
      } else {
        return res.render('login', { error: 'Invalid credentials' });
      }
    } else {
      return res.render('login', { error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal server error');
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
};