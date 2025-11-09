const express = require('express');
const router = express.Router();
const Folder = require('../models/Folder');

// Create folder
router.post('/', async (req, res) => {
  const { userId, name } = req.body;
  const folder = await Folder.create({ name, userId, files: [] });
  res.json(folder);
});

// Get all folders for user
router.get('/:userId', async (req, res) => {
  const folders = await Folder.find({ userId: req.params.userId });
  res.json(folders);
});

// Rename or delete
router.put('/:id', async (req, res) => {
  const { name } = req.body;
  const folder = await Folder.findByIdAndUpdate(req.params.id, { name }, { new: true });
  res.json(folder);
});

router.delete('/:id', async (req, res) => {
  await Folder.findByIdAndDelete(req.params.id);
  res.json({ message: 'Folder deleted' });
});

module.exports = router;
