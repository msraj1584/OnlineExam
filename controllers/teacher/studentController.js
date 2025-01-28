const bcrypt = require('bcrypt');
const User = require('../../models/User');
const Student = require('../../models/Student');
const Course = require('../../models/Course');
exports.getStudentDetails = async (req, res) => {
  try {
    const students = await Student.find().populate('courses').populate('user', 'name email');
    res.render('teacher/StudentList', { user: req.user, students });
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).send('Error fetching student details');
  }
};
exports.getCreateStudent = async (req, res) => {
  try {
    const courses = await Course.find();
    res.render('teacher/StudentAdd', { user: req.user, courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).send('Error fetching courses');
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { firstName, lastName, email, password, dob, courses } = req.body;

    // Create a new user
    const user = new User({
      name: `${firstName} ${lastName}`,
      email,
      password,
      role: 'Student',
    });

    await user.save();

    // Create a new student linked to the user
    const student = new Student({
      firstName,
      lastName,
      email,
      password,
      dob,
      courses,
      user: user._id,
    });

    await student.save();
    res.redirect('/teacher/student-details');
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error code
       const courses = await Course.find();
      res.render('teacher/StudentAdd', {
        user: req.user,
        student: null,
        courses,
        errorMessage: 'A user with this email already exists.',
      });
    } else {
      console.error('Error creating student:', error);
      res.status(500).send('Error creating student');
    }
  }
};
exports.getEditStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId).populate('courses').populate('user');
    const courses = await Course.find();
    res.render('teacher/StudentEdit', { user: req.user, student, courses });
  } catch (error) {
    console.error('Error fetching student for editing:', error);
    res.status(500).send('Error fetching student for editing');
  }
};

exports.postEditStudent = async (req, res) => {
    const { studentId } = req.params;
  try {
    
    const { firstName, lastName, email, password, dob, courses } = req.body;

    // Update the student details
    const student = await Student.findByIdAndUpdate(studentId, {
      firstName,
      lastName,
      email,
      dob,
      courses,
    }, { new: true }).populate('user');

    // Update the associated user details
    const userUpdate = {
      name: `${firstName} ${lastName}`,
      email,
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      userUpdate.password = await bcrypt.hash(password, salt);
    }

    await User.findByIdAndUpdate(student.user._id, userUpdate);

    res.redirect('/teacher/student-details');
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error code
      const student = await Student.findById(studentId).populate('courses').populate('user');
      const courses = await Course.find();
      res.render('teacher/StudentEdit', {
        user: req.user,
        student,
        courses,
        errorMessage: 'A user with this email already exists.',
      });
    } else {
      console.error('Error updating student:', error);
      res.status(500).send('Error updating student');
    }
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);

    // Delete the associated user
    await User.findByIdAndDelete(student.user);

    // Delete the student
    await Student.findByIdAndDelete(studentId);

    res.redirect('/teacher/student-details');
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).send('Error deleting student');
  }
};