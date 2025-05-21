const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Expense DB connected');
  } catch (err) {
    console.error('❌ Expense DB connection error:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
