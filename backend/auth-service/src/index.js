require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5009;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/auth_service', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Auth DB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Auth Service is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Auth Service is running on port ${PORT}`);
}); 