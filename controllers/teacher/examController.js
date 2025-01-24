const Exam = require('../../models/Exam');
const Question = require('../../models/Question');
const Course = require('../../models/Course');

exports.getExamDetails = async (req, res) => {
  try {
    const exams = await Exam.find().populate('course');
    const courses = await Course.find();
    res.render('teacher/ExamList', { user: req.user, exams, courses });
  } catch (error) {
    console.error('Error fetching exam details:', error);
    res.status(500).send('Error fetching exam details');
  }
};
exports.getCreateExam = async (req, res) => {
  try {
    const courses = await Course.find();
    res.render('teacher/ExamAdd', { user: req.user, courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).send('Error fetching courses');
  }
};

exports.postCreateExam = async (req, res) => {
  try {
    const { title, duration, date , courseId} = req.body;

    const exam = new Exam({
      title,
      duration,
      date,
      course: courseId,
    });
    await exam.save();
    const exams = await Exam.find().populate('course');
    const courses = await Course.find();
    res.render('teacher/ExamList', { user: req.user, exams, courses });
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).send('Error creating exam');
  }
};
exports.getEditExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const exam = await Exam.findById(examId).populate('course');
    const courses = await Course.find();
    res.render('teacher/ExamEdit', { user: req.user, exam , courses});
  } catch (error) {
    console.error('Error fetching exam for editing:', error);
    res.status(500).send('Error fetching exam for editing');
  }
};

exports.postEditExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { title, duration, date,courseId } = req.body;

    await Exam.findByIdAndUpdate(examId, {
      title,
      duration,
      date,
      course: courseId,
    });

    res.redirect('/teacher/exam-details');
  } catch (error) {
    console.error('Error updating exam:', error);
    res.status(500).send('Error updating exam');
  }
};
exports.deleteExam = async (req, res) => {
    try {
      const { examId } = req.params;
      const exam = await Exam.findById(examId).populate('questions');
  
     await Question.deleteMany({ _id: { $in: exam.questions } });
     await Exam.findByIdAndDelete(examId);
  
      res.redirect('/teacher/exam-details');
    } catch (error) {
      console.error('Error deleting exam:', error);
      res.status(500).send('Error deleting exam');
    }
  };
