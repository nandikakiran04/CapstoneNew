const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('TimeLog Service DB connected');
  } catch (err) {
    console.error('❌ TimeLog DB connection error:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
