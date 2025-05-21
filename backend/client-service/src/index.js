// File: client-service/src/index.js
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');

const clientRoutes = require('./routes/clientRouters');

const app = express();
app.use(cors());
app.use(express.json());

// 1) Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Client DB connected'))
  .catch(err => console.error('MongoDB error:', err));

// 2) Mount routes
app.use('/api/clients', clientRoutes);

// 3) Health check
app.get('/health', (_req, res) => res.json({ status: 'Client Service OK' }));

// 4) Start server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Client Service running on port ${PORT}`));
