const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/student/dashboardController');
const AttendExamController = require('../controllers/student/AttendExamController');
const examListController = require('../controllers/student/examListController');
const viewResultController = require('../controllers/student/viewResultController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// Use the authenticateJWT middleware for all routes in this router
router.use(authenticateJWT);

// DASHBOARD
router.get('/dashboard', dashboardController.getStudentDashboard);
router.get('/examlist', examListController.getExamList);

// ATTEND EXAM
router.get('/attend-exam/:examId', AttendExamController.getAttendExam);
router.post('/attend-exam/:examId', AttendExamController.postAttendExam);

// VIEW RESULT
router.get('/view-result/:examId', viewResultController.getViewResult);

module.exports = router;