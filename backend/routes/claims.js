const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const Item = require('../models/Item');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// POST /claim
router.post('/', authMiddleware, async (req, res) => {
  const claim = new Claim({ ...req.body, claimantId: req.user._id });
  await claim.save();
  // You can notify the poster here
  res.status(201).json(claim);
});

// GET claims for admin or user
router.get('/', authMiddleware, async (req, res) => {
  const claims = req.user.role === 'admin'
    ? await Claim.find().populate('itemId claimantId')
    : await Claim.find({ claimantId: req.user._id }).populate('itemId claimantId');
  res.json(claims);
});

// PUT /claims/:id/approve
router.put('/:id/approve', adminMiddleware, async (req, res) => {
  const claim = await Claim.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
  // Optionally, update item status, send notifications, etc.
  res.json(claim);
});
module.exports = router;
