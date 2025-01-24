const Result = require('../../models/Result');
const Exam = require('../../models/Exam');

exports.getExamResults = async (req, res) => {
  try {
    const { examId } = req.params;
    const exam = await Exam.findById(examId).populate('course');
    const results = await Result.find({ exam: examId }).populate('student');
    res.render('teacher/ExamResults', {
      user: req.user,
      exam,
      results,
    });
  } catch (error) {
    console.error('Error fetching exam results:', error);
    res.status(500).send('Error fetching exam results');
  }
};


exports.getExamResultDetails = async (req, res) => {
    try {
      const { resultId } = req.params;
      const result = await Result.findById(resultId).populate({
        path: 'student',
        populate: { path: 'user' }
      }).populate({
        path: 'answers.question',
        model: 'Question'
      }).populate('exam');
  
      res.render('teacher/ExamResultsDetails', {
        user: req.user,
        result,
        exam: result.exam,
      });
    } catch (error) {
      console.error('Error fetching exam result details:', error);
      res.status(500).send('Error fetching exam result details');
    }
  };