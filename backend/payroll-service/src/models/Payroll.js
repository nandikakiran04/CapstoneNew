const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema({
  employeeId: { type: String, required: true }, // Reference from employee service
  month: { type: Number, required: true }, // 1-12
  year: { type: Number, required: true },
  baseSalary: { type: Number, required: true },
  bonus: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  status: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
}, { timestamps: true });

payrollSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("Payroll", payrollSchema);
