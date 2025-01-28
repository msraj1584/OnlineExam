# Online Examination System

## Introduction
The Online Examination System is a web application that allows teachers to create exams with multiple-choice and descriptive questions, and students to attend these exams. Teachers can grade descriptive answers manually, and students can view their results.

## Features
- User authentication (login and registration)
- Teacher functionalities:
  - Create and manage exams
  - Add, edit, and list questions (multiple-choice and descriptive)
  - Grade descriptive answers
  - View exam results
- Student functionalities:
  - View available exams
  - Attend exams and submit answers
  - View exam results

## Project Structure
project/
│
├── controllers/
│   ├── teacher/
│   │   ├── questionController.js
│   │   ├── gradeController.js
│   │   └── resultController.js
│   ├── student/
│   │   └── attendExamController.js
│   └── authController.js
│
├── models/
│   ├── Exam.js
│   ├── Question.js
│   ├── Result.js
│   ├── Student.js
│   └── User.js
│
├── views/
│   ├── teacher/
│   │   ├── QuestionsAdd.ejs
│   │   ├── QuestionsEdit.ejs
│   │   ├── QuestionsList.ejs
│   │   ├── GradeDescriptive.ejs
│   │   └── ExamResultsDetails.ejs
│   ├── student/
│   │   ├── ExamAttend.ejs
│   │   └── ExamList.ejs
│   └── partials/
│       ├── header.ejs
│       ├── navbar.ejs
│       └── footer.ejs
│
├── routes/
│   ├── teacher.js
│   ├── student.js
│   └── auth.js
│
├── public/
│   ├── css/
│   │   └── ExamAttend.css
│   └── js/
│       └── main.js
│
├── app.js
├── package.json
└── README.md


## Models
### Exam.js
Defines the schema for an exam, including the title, date, and an array of questions.

### Question.js
Defines the schema for a question, including the type (multiple-choice or descriptive), the question text, options for multiple-choice questions, and the correct answer.

### Result.js
Defines the schema for a result, including references to the student and exam, the score, total questions, date, and an array of answers.

### Student.js
Defines the schema for a student, including a reference to the user and other student-specific information.

### User.js
Defines the schema for a user, including username, password, and role (teacher or student).

## Controllers
### teacher/questionController.js
Handles the creation, editing, and listing of questions for an exam.

### teacher/gradeController.js
Handles the grading of descriptive answers by teachers.

### teacher/resultController.js
Handles the display of exam results.

### student/attendExamController.js
Handles the attendance of exams by students, including the submission of answers.

### authController.js
Handles user authentication, including login and registration.

## Views
### teacher/QuestionsAdd.ejs
Form for adding new questions to an exam.

### teacher/QuestionsEdit.ejs
Form for editing existing questions in an exam.

### teacher/QuestionsList.ejs
List of questions for a specific exam.

### teacher/GradeDescriptive.ejs
Form for grading descriptive answers.

### teacher/ExamResultsDetails.ejs
Detailed view of exam results, including student answers and grades.

### student/ExamAttend.ejs
Form for attending an exam, including answering questions.

### student/ExamList.ejs
List of available exams for students to attend.

### partials/header.ejs
Common header for all views.

### partials/navbar.ejs
Common navigation bar for all views.

### partials/footer.ejs
Common footer for all views.

## Routes
### teacher.js
Routes for teacher-related actions, including managing questions and grading answers.

### student.js
Routes for student-related actions, including attending exams and viewing results.

### auth.js
Routes for authentication, including login and registration.
