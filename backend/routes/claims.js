const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const Item = require('../models/Item');
const { authMiddleware } = require('../middleware/auth');

// POST /claim
router.post('/', authMiddleware, async (req, res) => {
  const claim = new Claim({ ...req.body, claimantId: req.user._id });
  await claim.save();
  res.status(201).json(claim);
});

// GET claims for user
router.get('/', authMiddleware, async (req, res) => {
  const claims = await Claim.find({ claimantId: req.user._id }).populate('itemId claimantId');
  res.json(claims);
});

// PUT /claims/:id/approve
router.put('/:id/approve', authMiddleware, async (req, res) => {
  const claim = await Claim.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
  res.json(claim);
});
module.exports = router;
