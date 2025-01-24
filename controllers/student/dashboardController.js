
exports.getStudentDashboard = async (req, res) => {
  try {
    res.render('student/Dashboard', { user: req.user });
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).send('Error fetching exams');
  }
};