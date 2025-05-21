const Expense = require('../models/Expense');
const axios = require('axios');

// CRUD operations
exports.getAllExpenses = () => Expense.find().sort({ date: -1 });
exports.getExpenseById = id => Expense.findById(id);
exports.createExpense = data => Expense.create(data);
exports.updateExpense = (id, data) => Expense.findByIdAndUpdate(id, data, { new: true });
exports.deleteExpense = id => Expense.findByIdAndDelete(id);

// Get expenses with filters
exports.getFilteredExpenses = async (filters) => {
  return Expense.find(filters).sort({ date: -1 });
};

// Record payroll expense for a specific month
exports.recordMonthlyPayrollExpense = async (month, year) => {
  try {
    // Call payroll service to calculate total payroll for the month
    const PAYROLL_URL = process.env.PAYROLL_URL || 'http://localhost:5004/api/payrolls/calculate';
    const { data: payrollData } = await axios.post(PAYROLL_URL, {
      month,
      year
    });
    
    // Check if there are any payrolls for the month
    if (!payrollData || !payrollData.totalAmount || payrollData.totalAmount <= 0) {
      throw new Error('No payroll data available for the specified month');
    }
    
    // Check if expense already exists for this month/year
    const existingExpense = await Expense.findOne({
      type: 'payroll',
      date: {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1)
      }
    });
    
    // Update existing or create new
    if (existingExpense) {
      const updated = await Expense.findByIdAndUpdate(
        existingExpense._id,
        {
          amount: payrollData.totalAmount,
          description: `Total payroll expense for ${month}/${year}`,
          date: new Date(year, month - 1, 15) // Middle of month for consistency
        },
        { new: true }
      );
      return updated;
    } else {
      // Create new expense entry
      const expense = await Expense.create({
        type: 'payroll',
        amount: payrollData.totalAmount,
        description: `Total payroll expense for ${month}/${year}`,
        date: new Date(year, month - 1, 15) // Middle of month for consistency
      });
      return expense;
    }
  } catch (error) {
    console.error('Error recording monthly payroll expense:', error);
    throw error;
  }
};

// Get expenses by month/year with optional type filter
exports.getExpensesByMonthYear = async (month, year) => {
  const filter = {
    date: {
      $gte: new Date(year, month - 1, 1),
      $lt: new Date(year, month, 1)
    }
  };
  return Expense.find(filter).sort({ date: -1 });
};

// Record vendor bills as expenses for a specific month
exports.recordMonthlyVendorBills = async (month, year) => {
  try {
    // Call vendor service to get all bills for the month
    const VENDOR_URL = process.env.VENDOR_URL || 'http://localhost:5003/api/vendors';
    const { data: vendorData } = await axios.post(`${VENDOR_URL}/monthly-bills`, {
      month,
      year
    });
    
    // Check if there are any vendor bills for the month
    if (!vendorData || !vendorData.bills || vendorData.bills.length === 0) {
      throw new Error('No vendor bills available for the specified month');
    }
    
    const createdExpenses = [];
    
    // Create expense entries for each vendor bill
    for (const bill of vendorData.bills) {
      // Check if expense already exists for this bill
      const existingExpense = await Expense.findOne({
        type: 'vendor',
        vendor_id: bill.vendorId,
        bill_id: bill._id ? bill._id.toString() : undefined,
        bill_number: bill.billNumber
      });
      
      // If there's no direct bill ID match, try to find by description containing bill number
      let matchedExpense = existingExpense;
      if (!matchedExpense) {
        matchedExpense = await Expense.findOne({
          type: 'vendor',
          vendor_id: bill.vendorId,
          description: { $regex: new RegExp(`bill #${bill.billNumber}`, 'i') }
        });
      }
      
      if (matchedExpense) {
        // Update existing expense
        const updated = await Expense.findByIdAndUpdate(
          matchedExpense._id,
          {
            amount: bill.amount,
            description: `Payment for bill #${bill.billNumber} to ${bill.vendorName}`,
            date: bill.billDate || new Date(year, month - 1, 15),
            status: bill.status
          },
          { new: true }
        );
        createdExpenses.push(updated);
      } else {
        // Create new expense entry
        const expense = await Expense.create({
          type: 'vendor',
          amount: bill.amount,
          description: `Payment for bill #${bill.billNumber} to ${bill.vendorName}`,
          date: bill.billDate || new Date(year, month - 1, 15),
          vendor_id: bill.vendorId,
          bill_id: bill._id ? bill._id.toString() : undefined,
          bill_number: bill.billNumber,
          status: bill.status
        });
        createdExpenses.push(expense);
      }
    }
    
    return {
      expenses: createdExpenses,
      totalAmount: vendorData.totalAmount,
      count: createdExpenses.length
    };
  } catch (error) {
    console.error('Error recording monthly vendor bills:', error);
    throw error;
  }
};

// Get all individual vendor expenses for a specific month
exports.getMonthlyVendorExpenses = async (month, year) => {
  try {
    // Find all vendor expenses for the specified month
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);
    
    const vendorExpenses = await Expense.find({
      type: 'vendor',
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort('vendor_id');
    
    // Group by vendor_id
    const vendorExpenseMap = {};
    let totalAmount = 0;
    
    for (const expense of vendorExpenses) {
      if (!vendorExpenseMap[expense.vendor_id]) {
        vendorExpenseMap[expense.vendor_id] = [];
      }
      vendorExpenseMap[expense.vendor_id].push(expense);
      totalAmount += expense.amount;
    }
    
    // Convert to array of vendor expenses
    const result = Object.keys(vendorExpenseMap).map(vendorId => {
      const expenses = vendorExpenseMap[vendorId];
      const vendorTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
      
      return {
        vendor_id: vendorId,
        expenses: expenses,
        count: expenses.length,
        totalAmount: vendorTotal
      };
    });
    
    return {
      vendorExpenses: result,
      totalAmount,
      count: vendorExpenses.length
    };
  } catch (error) {
    console.error('Error getting monthly vendor expenses:', error);
    throw error;
  }
};