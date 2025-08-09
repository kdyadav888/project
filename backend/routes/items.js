const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const Item = require('../models/Item');

// GET /items?type=lost&search=blue+bag
router.get('/', async (req, res) => {
  const { type, search, category } = req.query;
  const filter = {};
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (search) filter.title = { $regex: search, $options: 'i' };
  const items = await Item.find(filter).populate('postedBy', 'name email');
  res.json(items);
});

// POST /items
router.post('/', authMiddleware, async (req, res) => {
  const item = new Item({ ...req.body, postedBy: req.user._id });
  await item.save();
  res.status(201).json(item);
});

// PATCH /items/:id/status
router.patch('/:id/status', authMiddleware, async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(item);
});
module.exports = router;
