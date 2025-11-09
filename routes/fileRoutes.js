const express = require('express');
const multer = require('multer');
const Folder = require('../models/Folder');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// make sure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// Upload file
router.post('/:folderId', upload.single('file'), async (req, res) => {
  const folder = await Folder.findById(req.params.folderId);
  folder.files.push({
    filename: req.file.filename,
    originalName: req.file.originalname,
  });
  await folder.save();
  res.json(folder);
});

// Rename file
router.put('/:folderId/:fileId', async (req, res) => {
  try {
    const { folderId, fileId } = req.params;
    const { newName } = req.body;

    const folder = await Folder.findById(folderId);
    if (!folder) return res.status(404).json({ message: 'Folder not found' });

    // Find file by _id instead of filename
    const file = folder.files.id(fileId);
    if (!file) return res.status(404).json({ message: 'File not found' });

    // Update file name
    file.originalName = newName;

    await folder.save();

    res.json({ message: 'File renamed successfully' });
  } catch (err) {
    console.error('Rename file error:', err);
    res.status(500).json({ message: 'Error renaming file' });
  }
});


// Delete file
router.delete('/:folderId/:fileId', async (req, res) => {
  try {
    const { folderId, fileId } = req.params;

    const folder = await Folder.findById(folderId);
    if (!folder) return res.status(404).json({ message: 'Folder not found' });

    const file = folder.files.id(fileId); // find by _id
    if (!file) return res.status(404).json({ message: 'File not found in DB' });

    // Compute file path
    const uploadDir = path.join(__dirname, '..', 'uploads');
    const filePath = path.join(uploadDir, file.filename);

    // Delete file from disk
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('Deleted file from disk:', file.filename);
    } else {
      console.warn('File not found on disk:', filePath);
    }

    // Remove file from DB array
    file.deleteOne();
    await folder.save();

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error('Delete file error:', err);
    res.status(500).json({ message: 'Error deleting file' });
  }
});


module.exports = router;
