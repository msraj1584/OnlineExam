const Exam = require('../../models/Exam');
const Result = require('../../models/Result');
const Student = require('../../models/Student');

exports.getAttendExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const exam = await Exam.findById(examId).populate('questions');
    res.render('student/ExamAttend', { user: req.user, exam });
  } catch (error) {
    console.error('Error fetching exam:', error);
    res.status(500).send('Error fetching exam');
  }
};
exports.postAttendExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { answers } = req.body;
    const userId = req.user.userId;
    const exam = await Exam.findById(examId).populate('questions');
    const student = await Student.findOne({ user: userId });
    if (!student) {
      return res.status(404).send('Student not found');
    }

    let score = 0;
    const answerDetails = [];

    exam.questions.forEach(question => {
      const correctAnswer = question.correctAnswer;
      const studentAnswer = answers ? answers[question._id] : undefined;
      if (studentAnswer !== undefined && parseInt(studentAnswer) === correctAnswer) {
        score++;
      }
      answerDetails.push({
        question: question._id,
        selectedAnswer: studentAnswer !== undefined ? parseInt(studentAnswer) : null,
      });
    });

    // Store the result
    const result = new Result({
      student: student._id,
      exam: exam._id,
      score: score,
      totalQuestions: exam.questions.length,
      answers: answerDetails,
    });

    await result.save();

    res.redirect('/student/examlist');
  } catch (error) {
    console.error('Error submitting exam:', error);
    res.status(500).send('Error submitting exam');
  }
};