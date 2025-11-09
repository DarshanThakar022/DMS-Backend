// server.js
require('dotenv').config(); // load .env locally (Render provides env automatically)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());

// CORS - allow your frontend domain(s)
const FRONTEND_URL = process.env.FRONTEND_URL || '*'; // set FRONTEND_URL in Render to your Vercel URL
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true
}));

// Static uploads (if you use uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Simple health route ---
app.get('/', (req, res) => {
  res.send({ status: 'ok', message: 'Server running' });
});

// --- Example test route you can use to check deployment ---
app.get('/api/test', (req, res) => {
  res.json({ success: true, msg: 'API is working' });
});

// --- Connect to MongoDB ---
const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // fail fast if can't connect
    });
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    // crash the process so Render shows failure and you can inspect logs
    process.exit(1);
  }
};

connectToMongo();

// --- Routes (your existing route files) ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/folders', require('./routes/folderRoutes'));
app.use('/api/files', require('./routes/fileRoutes'));

// --- Start server on Render's PORT ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
