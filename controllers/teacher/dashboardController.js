const Course = require('../../models/Course');
const Exam = require('../../models/Exam');
const Student = require('../../models/Student');

exports.getDashboard = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const totalExams = await Exam.countDocuments();
    const totalStudents = await Student.countDocuments();

    res.render('teacher/Dashboard', {
      user: req.user,
      totalCourses,
      totalExams,
      totalStudents,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).send('Error fetching dashboard data');
  }
};