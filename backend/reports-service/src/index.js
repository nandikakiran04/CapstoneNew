const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const reportRoutes = require('./routes/reportRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB with more options for reliability
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/erp_reports';
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    retryWrites: true
})
.then(() => console.log('Reports DB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/reports', reportRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'Reports Service OK' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
    console.log(`Reports service listening on port ${PORT}`);
});