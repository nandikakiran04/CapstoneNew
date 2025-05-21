// File: timeLog-service/src/index.js
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');

const timeLogRoutes = require('./routes/timeLogRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// 1) Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('TimeLog DB connected'))
  .catch(err => console.error('MongoDB error:', err));

// 2) Mount routes
app.use('/api/timelogs', timeLogRoutes);

// 3) Health check
app.get('/health', (_req, res) => res.json({ status: 'TimeLog Service OK' }));

// 4) Start server
const PORT = process.env.PORT || 5006;
app.listen(PORT, () => console.log(`TimeLog Service running on port ${PORT}`));
