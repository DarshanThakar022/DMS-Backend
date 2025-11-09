const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  files: [
    {
      filename: String,
      originalName: String,
    },
  ],
});

module.exports = mongoose.model('Folder', folderSchema);
