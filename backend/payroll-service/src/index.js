// File: payroll-service/src/index.js
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const redis    = require('redis');

const payrollRoutes = require('./routes/payrollRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// 1) Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Payroll DB connected'))
  .catch(err => console.error('MongoDB error:', err));

// 2) Setup Redis subscriber & publisher with fallback
let sub, pub;
(async () => {
  try {
    sub = redis.createClient({ url: process.env.REDIS_URL });
    pub = redis.createClient({ url: process.env.REDIS_URL });
    await sub.connect();
    await pub.connect();
    console.log('Redis connected for Payroll');
    // subscribe to employee.created
    sub.subscribe('employee.created', msg => {
      const emp = JSON.parse(msg);
      // assume payrollService will pick this up from app.locals
      app.locals.employeeCache = app.locals.employeeCache || new Map();
      app.locals.employeeCache.set(emp.id, emp);
    });
  } catch (err) {
    console.warn('⚠️ Redis unavailable, running Payroll without Pub/Sub');
    // dummy no-ops
    pub = { publish: async () => {} };
    sub = { subscribe: async () => {} };
    app.locals.employeeCache = new Map();
  }

  // expose pub/sub in locals for routes/services
  app.locals.pub = pub;
  app.locals.sub = sub;

  
  // 3) Mount routes
  app.use('/api/payrolls', payrollRoutes);

  // 4) Health check
  app.get('/health', (_req, res) => res.json({ status: 'Payroll Service OK' }));

  // 5) Start server
  const PORT = process.env.PORT || 5004;
  app.listen(PORT, () => console.log(`Payroll Service running on port ${PORT}`));
})();
