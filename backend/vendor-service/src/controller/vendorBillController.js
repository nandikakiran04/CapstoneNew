const mongoose = require('mongoose');
const axios = require('axios');
const VendorBill = require('../model/vendorBill.js');
const Vendor = require('../model/vendor');

// Create a new vendor bill
exports.createVendorBill = async (req, res) => {
  try {
    const { vendorId } = req.params;
    
    // Verify vendor exists
    const vendor = await Vendor.findOne({ vendorId });
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    // Create the bill
    const billData = {
      ...req.body,
      vendorId
    };
    
    const bill = new VendorBill(billData);
    await bill.save();
    
    // Create expense record for the bill
    try {
      const expense = await createExpenseFromBill(bill, vendor.name);
      res.status(201).json({
        bill,
        expense,
        message: 'Bill and corresponding expense created successfully'
      });
    } catch (expenseErr) {
      console.error('Failed to create expense for bill:', {
        billNumber: bill.billNumber,
        error: expenseErr.message
      });
      res.status(201).json({
        bill,
        expenseError: expenseErr.message,
        message: 'Bill created but expense creation failed'
      });
    }
  } catch (err) {
    console.error('Error creating vendor bill:', err);
    res.status(400).json({ error: err.message });
  }
};

// Get all bills for a specific vendor
exports.getVendorBills = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { month, year } = req.query;
    
    const filter = { vendorId };
    
    // Apply date filter if month and year are provided
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);
      
      filter.billDate = {
        $gte: startDate,
        $lte: endDate
      };
    }
    
    const bills = await VendorBill.find(filter).sort({ billDate: -1 });
    res.json(bills);
  } catch (err) {
    console.error('Error getting vendor bills:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get a single vendor bill by ID
exports.getVendorBillById = async (req, res) => {
  try {
    const { billId } = req.params;
    
    const bill = await VendorBill.findById(billId);
    if (!bill) {
      return res.status(404).json({ error: 'Vendor bill not found' });
    }
    
    res.json(bill);
  } catch (err) {
    console.error('Error getting vendor bill:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update a vendor bill
exports.updateVendorBill = async (req, res) => {
  try {
    const { billId } = req.params;
    const updates = req.body;
    
    const bill = await VendorBill.findByIdAndUpdate(
      billId,
      updates,
      { new: true }
    );
    
    if (!bill) {
      return res.status(404).json({ error: 'Vendor bill not found' });
    }
    
    // Get vendor for the bill
    const vendor = await Vendor.findOne({ vendorId: bill.vendorId });
    
    // Update the expense record
      try {
      const expense = await updateExpenseForBill(bill, vendor ? vendor.name : 'Unknown Vendor');
      res.json({
        bill,
        expense,
        message: 'Bill and corresponding expense updated successfully'
      });
      } catch (expenseErr) {
      console.error('Error updating expense:', expenseErr);
      res.json({
        bill,
        expenseError: expenseErr.message,
        message: 'Bill updated but expense update failed'
      });
    }
  } catch (err) {
    console.error('Error updating vendor bill:', err);
    res.status(400).json({ error: err.message });
  }
};

// Delete a vendor bill
exports.deleteVendorBill = async (req, res) => {
  try {
    const { billId } = req.params;
    
    const bill = await VendorBill.findByIdAndDelete(billId);
    if (!bill) {
      return res.status(404).json({ error: 'Vendor bill not found' });
    }
    
    // Delete the corresponding expense
    try {
      await deleteExpenseForBill(bill);
      res.json({ message: 'Vendor bill and corresponding expense deleted successfully' });
    } catch (expenseErr) {
      console.error('Error deleting expense:', expenseErr);
      res.json({ 
        message: 'Vendor bill deleted but expense deletion failed',
        error: expenseErr.message
      });
    }
  } catch (err) {
    console.error('Error deleting vendor bill:', err);
    res.status(500).json({ error: err.message });
  }
};

// Create an expense record from a bill
const createExpenseFromBill = async (bill, vendorName = 'Unknown Vendor') => {
  try {
    const expenseData = {
      type: 'vendor',
      amount: bill.amount,
      description: bill.description || `Bill #${bill.billNumber} from ${vendorName}`,
      date: bill.billDate || new Date(),
      vendor_id: bill.vendorId,
      bill_id: bill._id.toString(),
      bill_number: bill.billNumber
    };
    
    const EXPENSES_URL = process.env.EXPENSES_URL || 'http://localhost:5005/api/expenses';
    console.log('Creating expense for bill:', bill.billNumber);
    
    const { data } = await axios.post(EXPENSES_URL, expenseData);
    console.log('Successfully created expense for bill:', bill.billNumber);
    return data;
  } catch (err) {
    console.error('Error creating expense from bill:', {
      billNumber: bill.billNumber,
      error: err.message,
      response: err.response?.data
    });
    throw err;
  }
};

// Update an expense record for a bill
const updateExpenseForBill = async (bill, vendorName = 'Unknown Vendor') => {
  try {
    const EXPENSES_URL = process.env.EXPENSES_URL || 'http://localhost:5005/api/expenses';
    const { data: expenses } = await axios.get(`${EXPENSES_URL}?vendor_id=${bill.vendorId}&description=${encodeURIComponent(bill.billNumber)}`);
    
    if (expenses && expenses.length > 0) {
      const expense = expenses[0];
      const updateData = {
        amount: bill.amount,
        description: bill.description || `Bill #${bill.billNumber} from ${vendorName}`,
        date: bill.billDate || expense.date
      };
      
      const { data } = await axios.put(`${EXPENSES_URL}/${expense._id}`, updateData);
      return data;
    } else {
      return createExpenseFromBill(bill, vendorName);
    }
  } catch (err) {
    console.error('Error updating expense for bill:', err);
    throw err;
  }
};

// Delete an expense record for a bill
const deleteExpenseForBill = async (bill) => {
  try {
    const EXPENSES_URL = process.env.EXPENSES_URL || 'http://localhost:5005/api/expenses';
    const { data: expenses } = await axios.get(`${EXPENSES_URL}?vendor_id=${bill.vendorId}&description=${encodeURIComponent(bill.billNumber)}`);
    
    if (expenses && expenses.length > 0) {
      const expense = expenses[0];
      await axios.delete(`${EXPENSES_URL}/${expense._id}`);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Error deleting expense for bill:', err);
    throw err;
  }
};

// Get all monthly vendor bills
exports.getMonthlyVendorBills = async (req, res) => {
  try {
    const { month, year } = req.body;
    
    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required' });
    }
    
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);
    
    const bills = await VendorBill.find({
      billDate: {
        $gte: startDate,
        $lte: endDate
      }
    });
    
    const enrichedBills = [];
    let totalAmount = 0;
    
    for (const bill of bills) {
      const vendor = await Vendor.findOne({ vendorId: bill.vendorId });
      enrichedBills.push({
        ...bill.toObject(),
        vendorName: vendor ? vendor.name : 'Unknown Vendor'
      });
      totalAmount += bill.amount;
    }
    
    res.json({
      bills: enrichedBills,
      totalAmount,
      count: enrichedBills.length
    });
  } catch (err) {
    console.error('Error getting monthly vendor bills:', err);
    res.status(500).json({ error: err.message });
  }
};

// Export the utility functions
exports.createExpenseFromBill = createExpenseFromBill;
exports.updateExpenseForBill = updateExpenseForBill;
exports.deleteExpenseForBill = deleteExpenseForBill;