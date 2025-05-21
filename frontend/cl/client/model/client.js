const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  industry: { type: String },
  address: { type: String },
  poc_name: { type: String, required: true },
  poc_email: { type: String, required: true },
  poc_phone: { type: String },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

// Automatically update `updatedAt` on update operations
clientSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});


module.exports = mongoose.model("Client", clientSchema);