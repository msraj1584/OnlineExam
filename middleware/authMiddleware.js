const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token; // Retrieve token from cookies

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.redirect('/'); // Redirect to login if token is invalid
      }
      req.user = user;
      next();
    });
  } else {
    res.redirect('/'); // Redirect to login if no token
  }
};

module.exports = {
  authenticateJWT,
};
