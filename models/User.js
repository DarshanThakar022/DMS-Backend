const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  password: { type: String, required: true, minlength: 4, maxlength: 4 },
});

module.exports = mongoose.model('User', userSchema);
