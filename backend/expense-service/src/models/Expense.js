const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['payroll', 'vendor', 'misc'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: String,
  date: {
    type: Date,
    default: Date.now
  },
  employee_id: String,
  vendor_id: String,
  // Added fields to better track vendor bill expenses
  bill_id: String,
  bill_number: String,
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue', null],
    default: null
  }
}, { timestamps: true });

// Create indexes for common queries
expenseSchema.index({ type: 1, date: -1 });
expenseSchema.index({ vendor_id: 1, bill_number: 1 }, { sparse: true });
expenseSchema.index({ type: 1, vendor_id: 1, date: -1 });

module.exports = mongoose.model('Expense', expenseSchema);