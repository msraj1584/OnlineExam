const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: Number, required: true }, // Duration in minutes
  date: { type: Date, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  }, { collection: 'exam' });

module.exports = mongoose.model('Exam', examSchema);