const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb+srv://darshan:darshan2304@cluster5.xdp2gyp.mongodb.net/?appName=Cluster5')
  .then(() => console.log('MongoDB Connected'));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/folders', require('./routes/folderRoutes'));
app.use('/api/files', require('./routes/fileRoutes'));

app.listen(5000, () => console.log('Server running on port 5000'));
