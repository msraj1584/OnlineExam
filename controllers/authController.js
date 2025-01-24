const jwt = require('jsonwebtoken');
const User = require('../models/User');


exports.login = async (req, res) => {
  const { email, password, role} = req.body;

  try {
    const user = await User.findOne({ email,role });

    if (user && user.password === password) {
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role ,name:user.name },
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
      } else {
        return res.status(403).send('Access denied');
      }
    } else {
      return res.render('login', { error: 'Invalid credentials' });
    }
  } catch (error) {
    return res.status(500).send('Internal server error');
  }
};