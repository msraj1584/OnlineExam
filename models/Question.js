const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ['multiple-choice', 'descriptive'], required: true },
  question: { type: String, required: true },
  options: [{ type: String }], // Options are only required for multiple-choice questions
  correctAnswer: { type: Number }, // Correct answer index for multiple-choice questions
  descriptiveAnswer: { type: String }, // Correct answer for descriptive questions
}, { collection: 'question' });

module.exports = mongoose.model('Question', questionSchema);