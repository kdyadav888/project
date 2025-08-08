const mongoose = require('mongoose');
const ClaimSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  claimantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Claim', ClaimSchema);
