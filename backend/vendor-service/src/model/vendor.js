const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  vendorId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  serviceType: { type: String },
  address: { type: String },
  website: { type: String },  
  contact: { type: String },
  email: { type: String },
  MonthlyCharges: {type: Number},
  pocName: { type: String, required: true },                   // Point of contact - full name
  pocEmail: { type: String, required: true, lowercase: true, trim: true }, // Contact email
  pocPhone: { type: String, required: true },
  gstNumber: { type: String },       // Optional addition
  panNumber: { type: String },       // Optional addition
  isActive: { type: Boolean, default: true },                  // Vendor active/inactive flag
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }  
});
vendorSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

module.exports = mongoose.model('Vendor', vendorSchema);
