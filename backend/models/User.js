const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  blocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', UserSchema);
