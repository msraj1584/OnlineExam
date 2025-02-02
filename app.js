const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const teacherRoutes = require('./routes/teacher');
const User = require('./models/User'); // Import the User model

// Load environment variables
dotenv.config();

const app = express();
// Use cookie-parser middleware to parse cookies
app.use(cookieParser());

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use(authRoutes);
app.use('/student', studentRoutes);
app.use('/teacher', teacherRoutes);

// Root route
app.get('/', (req, res) => {
  res.render('login');
});

// Function to create a default Teacher user on First run of the application. 
const createDefaultTeacher = async () => {
  try {
    const existingTeacher = await User.findOne({ role: 'Teacher' });
    if (!existingTeacher) {
      const defaultTeacher = new User({
        name: 'Teacher',
        email: 't@msraj.in',
        password: 't', 
        role: 'Teacher'
      });

      await defaultTeacher.save();
      console.log('Default Teacher user created');
    } 
  } catch (error) {
    console.error('Error creating default Teacher user', error);
  }
};
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async() => {
    console.log('Connected to MongoDB');
    await createDefaultTeacher(); // Create default Teacher user
    // Start the server
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });
