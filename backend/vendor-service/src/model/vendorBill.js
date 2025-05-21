const mongoose = require('mongoose');

const vendorBillSchema = new mongoose.Schema({
  vendorId: { 
    type: String, 
    required: true,
    ref: 'Vendor'
  },
  billNumber: { 
    type: String, 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  dueDate: { 
    type: Date, 
    required: true 
  },
  billDate: { 
    type: Date, 
    default: Date.now 
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  frequency: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly', null],
    default: null
  }
}, { timestamps: true });

// Compound index to ensure uniqueness of vendor's bill numbers
vendorBillSchema.index({ vendorId: 1, billNumber: 1 }, { unique: true });

module.exports = mongoose.model('VendorBill', vendorBillSchema);