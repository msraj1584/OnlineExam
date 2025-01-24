const Exam = require('../../models/Exam');
const Question = require('../../models/Question');

exports.getExamQuestions = async (req, res) => {
  try {
    const { examId } = req.params;
    const exam = await Exam.findById(examId).populate('questions');
    res.render('teacher/QuestionsList', { user: req.user, exam });
  } catch (error) {
    console.error('Error fetching exam questions:', error);
    res.status(500).send('Error fetching exam questions');
  }
};

exports.getAddQuestion = async (req, res) => {
  try {
    const { examId } = req.params;
    const exam = await Exam.findById(examId);
    res.render('teacher/QuestionsAdd', { user: req.user, examId,exam });
  } catch (error) {
    console.error('Error rendering add question page:', error);
    res.status(500).send('Error rendering add question page');
  }
};

exports.postAddQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer } = req.body;
    const { examId } = req.params;

    const questionDoc = new Question({
      question,
      options,
      correctAnswer,
    });

    await questionDoc.save();

    await Exam.findByIdAndUpdate(examId, {
      $push: { questions: questionDoc._id },
    });

    res.redirect(`/teacher/exam-questions/${examId}`);
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).send('Error adding question');
  }
};


exports.getEditQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { examId } = req.query;
        const question = await Question.findById(questionId);
        const exam = await Exam.findById(examId);
        res.render('teacher/QuestionsEdit', { user: req.user, question, examId,exam });
    } catch (error) {
      console.error('Error rendering edit question page:', error);
      res.status(500).send('Error rendering edit question page');
    }
  };

exports.postEditQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { examId } = req.query;
    const { question, options, correctAnswer } = req.body;

    await Question.findByIdAndUpdate(questionId, {
      question,
      options,
      correctAnswer,
    });

    res.redirect(`/teacher/exam-questions/${examId}`);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).send('Error updating question');
  }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { examId } = req.query;
    
        await Question.findByIdAndDelete(questionId);
    
        await Exam.findByIdAndUpdate(examId, {
          $pull: { questions: questionId },
        });
    
        res.redirect(`/teacher/exam-questions/${examId}`);
    } catch (error) {
      console.error('Error deleting question:', error);
      res.status(500).send('Error deleting question');
    }
  };