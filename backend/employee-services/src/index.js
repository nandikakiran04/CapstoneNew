require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const redis    = require('redis');

const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// 1) Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Employee DB connected'))
  .catch(err => console.error('MongoDB error:', err));

// 2) Setup Redis publisher, with graceful fallback
let pub;
(async () => {
  try {
    pub = redis.createClient({ url: process.env.REDIS_URL });
    await pub.connect();
    console.log('Redis connected');
  } catch (err) {
    console.warn('⚠️  Redis unavailable, continuing without Pub/Sub');
    // create a dummy object with a no-op publish method
    pub = { publish: async () => {} };
  }
  // 3) Make pub available in routes/controllers via app.locals
  app.locals.pub = pub;

  // 4) Mount routes only after pub is set
  app.use('/api/employees', employeeRoutes);

  // 5) Health check
  app.get('/health', (_req, res) => res.json({ status: 'Employee Service OK' }));

  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Employee Service running on port ${PORT}`));
})();
