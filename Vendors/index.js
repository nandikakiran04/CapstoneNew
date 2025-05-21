const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); 

const cors = require('cors');
const vendorRoutes = require('./routes/vendorroutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
// Routes
app.use('/api/vendors', vendorRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('DB Connection Error:', err.message);
});
