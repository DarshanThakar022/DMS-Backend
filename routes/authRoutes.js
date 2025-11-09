const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login or Register
router.post('/login', async (req, res) => {
  const { password } = req.body;

  let user = await User.findOne({ password });
  if (!user) {
    user = await User.create({ password });
  }
  res.json({ message: 'Logged in', userId: user._id });
});

module.exports = router;
