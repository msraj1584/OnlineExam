const Result = require('../../models/Result');
const Exam = require('../../models/Exam');

exports.getGradeDescriptive = async (req, res) => {
  try {
    const { resultId } = req.params;
    const result = await Result.findById(resultId).populate('answers.question');
    const exam = await Exam.findById(result.exam);
    res.render('teacher/GradeDescriptive', { user: req.user, result, exam });
  } catch (error) {
    console.error('Error fetching result for grading:', error);
    res.status(500).send('Error fetching result for grading');
  }
};

exports.postGradeDescriptive = async (req, res) => {
  try {
    const { resultId } = req.params;
    const { grades } = req.body;

    const result = await Result.findById(resultId);
    
    result.answers.forEach(answer => {
      if (grades[answer.question]) {
        answer.grade = grades[answer.question];      
      }
    });

    let totalGrade = 0;
    result.answers.forEach(answer => {
      if (answer.grade) {
        totalGrade += answer.grade;
      }
    });
    result.score = totalGrade;

    await result.save();
    res.redirect(`/teacher/exam-results/${result.exam}`);
  } catch (error) {
    console.error('Error saving grades:', error);
    res.status(500).send('Error saving grades');
  }
};