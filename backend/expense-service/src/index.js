require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const connectDB = require('./config/db');
const routes    = require('./routes/expenseRoutes');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/expenses', routes);

app.get('/health', (_req, res) => res.json({ status: 'Expense Service OK' }));

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Expense Service running on port ${PORT}`));








// require('dotenv').config();
// const express  = require('express');
// const cors     = require('cors');
// const redis    = require('redis');
// const connectDB = require('./config/db');
// const expenseRoutes = require('./routes/expenseRoutes');
// const expenseService = require('./services/expenseService');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // 1) Connect to MongoDB
// connectDB();

// // 2) Setup Redis subscriber with fallback
// (async () => {
//   try {
//     const sub = redis.createClient({ url: process.env.REDIS_URL });
//     await sub.connect();
//     console.log('✅ Redis connected for Expense');

//     await sub.subscribe('payroll.generated', async msg => {
//       const pr = JSON.parse(msg);
//       await expenseService.recordPayrollExpense(pr);
//       console.log('➡️ Recorded payroll expense event');
//     });
//   } catch (err) {
//     console.warn('⚠️ Redis unavailable, skipping payroll-generated subscription');
//   }

//   // 3) Mount routes
//   app.use('/api/expenses', expenseRoutes);

//   // 4) Health check
//   app.get('/health', (_req, res) => {
//     res.json({ status: 'Expense Service OK' });
//   });

//   // 5) Start server
//   const PORT = process.env.PORT || 5005;
//   app.listen(PORT, () => console.log(`Expense Service running on port ${PORT}`));
// })();
