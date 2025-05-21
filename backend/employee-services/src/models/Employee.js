const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true, unique: true },
  role:        { type: String, required: true },
  base_salary: { type: Number, required: true },
  salary_type: { type: String, enum: ['monthly', 'hourly'], required: true },
  active:      { type: Boolean, default: true }, createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }  
});
employeeSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

module.exports = mongoose.model('Employee', employeeSchema);
