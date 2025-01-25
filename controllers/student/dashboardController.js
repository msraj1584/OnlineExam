const Exam = require('../../models/Exam');
const Result = require('../../models/Result');
const Student = require('../../models/Student');

exports.getStudentDashboard = async (req, res) => {
  try {
const userId = req.user.userId;
    // Fetch the student's enrolled courses
    const student = await Student.findOne({ user: userId }).populate('courses');
    if (!student) {
      return res.status(404).send('Student not found');
    }
    const enrolledCourseIds = student.courses.map(course => course._id);

    // Fetch completed exam IDs
    const completedResults = await Result.find({ student: student._id }).populate({
      path: 'exam',
      populate: { path: 'course' }
    });
    const completedExamIds = completedResults.map(result => result.exam._id);

    // Fetch available exams directly using $nin and course filter
    const availableExams = await Exam.find({ 
      _id: { $nin: completedExamIds },
      course: { $in: enrolledCourseIds }
    }).populate('course');
    
    // Map completed exams
    const completedExams = completedResults.map(result => result.exam);

    res.render('student/Dashboard', { 
      user: req.user, 
      availableExamCount: availableExams.length,
      completedExamCount: completedExams.length, });
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).send('Error fetching exams');
  }
};