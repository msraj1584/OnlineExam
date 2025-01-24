const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['Student', 'Teacher'], required: true },
  
},{ collection: 'user' });

module.exports = mongoose.model('User', userSchema);
