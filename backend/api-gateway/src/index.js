// File: api-gateway/src/index.js
const express = require('express');
const cors    = require('cors');
const app     = express();

const employeeRoutes  = require('./routes/employeeRoutes');
const projectRoutes   = require('./routes/projectRoutes');
const clientRoutes    = require('./routes/clientRoutes');
const reportRoutes    = require('./routes/reportRoutes');
const payrollRoutes   = require('./routes/payrollRoutes');
const timeLogRoutes   = require('./routes/timeLogRoutes');
const expenseRoutes   = require('./routes/expenseRoutes');
const vendorRoutes    = require('./routes/vendorRoutes');
const authRoutes      = require('./routes/authRoutes');

app.use(cors());
app.use(express.json());

// Mount each service router on its static path
app.use('/api/employees',  employeeRoutes);
app.use('/api/projects',   projectRoutes);
app.use('/api/clients',    clientRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/payrolls',    payrollRoutes);
app.use('/api/timelogs',   timeLogRoutes); 
app.use('/api/expenses', expenseRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/auth',       authRoutes);

// app.use('/api/payroll', require('./routes/payroll'));

app.get('/health', (_req, res) => {
  res.json({ status: 'API Gateway OK' });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API Gateway listening on port ${PORT}`));
