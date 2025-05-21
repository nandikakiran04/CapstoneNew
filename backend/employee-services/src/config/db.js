const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Employee service DB connected");
  } catch (err) {
    console.error("Mongo connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
