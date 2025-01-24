const express = require('express');
const router = express.Router();
const examController = require('../controllers/teacher/examController');
const studentController = require('../controllers/teacher/studentController');
const courseController = require('../controllers/teacher/courseController');
const questionController = require('../controllers/teacher/questionController');
const dashboardController = require('../controllers/teacher/dashboardController');
const resultController = require('../controllers/teacher/resultController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// Use the authenticateJWT middleware for all routes in this router
router.use(authenticateJWT);

//DASHBOARD
router.get('/dashboard', dashboardController.getDashboard);

// COURSE
router.get('/courses', courseController.getCourses);
router.get('/create-course', (req, res) => {
  res.render('teacher/CourseAdd', { user: req.user });
});
router.post('/create-course', courseController.createCourse);
router.get('/edit-course/:courseId', courseController.getEditCourse);
router.post('/edit-course/:courseId', courseController.postEditCourse);
router.post('/delete-course/:courseId', courseController.deleteCourse);

//EXAM
router.get('/exam-details', examController.getExamDetails);
router.get('/CreateExam', examController.getCreateExam);
router.get('/CreateExam', (req, res) => {
  res.render('teacher/CreateExam', { user: req.user });
});
router.post('/CreateExam', examController.postCreateExam);
router.get('/edit-exam/:examId', examController.getEditExam);
router.post('/edit-exam/:examId', examController.postEditExam);
router.post('/delete-exam/:examId', examController.deleteExam);

// QUESTION
router.get('/exam-questions/:examId', questionController.getExamQuestions);
router.get('/AddQuestions/:examId', questionController.getAddQuestion);
router.post('/AddQuestions/:examId', questionController.postAddQuestion);
router.get('/edit-question/:questionId', questionController.getEditQuestion);
router.post('/edit-question/:questionId', questionController.postEditQuestion);
router.post('/delete-question/:questionId', questionController.deleteQuestion);

// STUDENT
router.get('/student-details', studentController.getStudentDetails);
router.get('/CreateStudent', studentController.getCreateStudent);
router.post('/CreateStudent', studentController.createStudent);
router.get('/edit-student/:studentId', studentController.getEditStudent);
router.post('/edit-student/:studentId', studentController.postEditStudent);
router.post('/delete-student/:studentId', studentController.deleteStudent);


// RESULTS
router.get('/exam-results/:examId', resultController.getExamResults);
router.get('/exam-result-details/:resultId', resultController.getExamResultDetails);
module.exports = router;