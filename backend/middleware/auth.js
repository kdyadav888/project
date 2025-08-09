const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No auth token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user || req.user.blocked) throw new Error();
    next();
  } catch {
    res.status(401).json({ error: 'Invalid auth token' });
  }
};

module.exports = { authMiddleware };
