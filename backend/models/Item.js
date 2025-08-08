const mongoose = require('mongoose');
const ItemSchema = new mongoose.Schema({
  type: { type: String, enum: ['lost', 'found'], required: true },
  title: String,
  description: String,
  category: String,
  location: String,
  date: Date,
  photoUrl: String,
  status: { type: String, enum: ['active', 'claimed', 'returned'], default: 'active' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  claimQuestion: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Item', ItemSchema);
