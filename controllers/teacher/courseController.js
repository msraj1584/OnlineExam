const Course = require('../../models/Course');
const Exam = require('../../models/Exam');
const Question = require('../../models/Question');
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.render('teacher/CourseList', { user: req.user, courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).send('Error fetching courses');
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { name, description } = req.body;

    const course = new Course({
      name,
      description,
    });

    await course.save();
    res.redirect('/teacher/courses');
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).send('Error creating course');
  }
};

exports.getEditCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    res.render('teacher/CourseEdit', { user: req.user, course });
  } catch (error) {
    console.error('Error fetching course for editing:', error);
    res.status(500).send('Error fetching course for editing');
  }
};

exports.postEditCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { name, description } = req.body;

    await Course.findByIdAndUpdate(courseId, {
      name,
      description,
    });

    res.redirect('/teacher/courses');
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).send('Error updating course');
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    // Find and delete all exams associated with the course
    const exams = await Exam.find({ course: courseId });
    for (const exam of exams) {
      // Delete each question associated with the exam
      for (const questionId of exam.questions) {
        await Question.findByIdAndDelete(questionId);
      }
      // Delete the exam
      await Exam.findByIdAndDelete(exam._id);
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);
    res.redirect('/teacher/courses');
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).send('Error deleting course');
  }
};