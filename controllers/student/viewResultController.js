const Result = require('../../models/Result');
const Exam = require('../../models/Exam');
const Student = require('../../models/Student');
exports.getViewResult = async (req, res) => {
  try {
     const userId = req.user.userId;
    const { examId } = req.params;
    const student = await Student.findOne({ user: userId });
        if (!student) {
          return res.status(404).send('Student not found');
        }

    const studentId = student._id;

    // Fetch the result for the given exam and student
    const result = await Result.findOne({ exam: examId, student: studentId }).populate('exam').populate('answers.question');
    if (!result) {
      return res.status(404).send('Result not found');
    }

    res.render('student/ViewResult', { user: req.user, result });
  } catch (error) {
    console.error('Error fetching result:', error);
    res.status(500).send('Error fetching result');
  }
};