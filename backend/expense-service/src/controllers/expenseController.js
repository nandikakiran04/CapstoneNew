const expenseService = require('../services/expenseService');
const Expense = require('../models/Expense');
const axios = require('axios');

// Get all expenses with optional filtering
exports.getExpenses = async (req, res) => {
  try {
    const { type, vendor_id, employee_id, month, year } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (vendor_id) filter.vendor_id = vendor_id;
    if (employee_id) filter.employee_id = employee_id;

    if (month || year) {
      filter.date = {};
      
      if (month && year) {
        // Start of month
        const startDate = new Date(year, month - 1, 1);
        // Start of next month
        const endDate = new Date(year, month, 1);
        
        filter.date = {
          $gte: startDate,
          $lt: endDate
        };
      } else if (year) {
        // Start of year
        const startDate = new Date(year, 0, 1);
        // Start of next year
        const endDate = new Date(parseInt(year) + 1, 0, 1);
        
        filter.date = {
          $gte: startDate,
          $lt: endDate
        };
      }
    }

    const expenses = await expenseService.getFilteredExpenses(filter);
    res.json(expenses);
  } catch (err) {
    console.error('Expense/getExpenses error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get expense by ID
exports.getById = async (req, res) => {
  try {
    const expense = await expenseService.getExpenseById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    console.error('Expense/getById error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Create expense
exports.create = async (req, res) => {
  try {
    const expense = await expenseService.createExpense(req.body);
    res.status(201).json(expense);
  } catch (err) {
    console.error('Expense/create error:', err);
    res.status(400).json({ error: err.message });
  }
};

// Update expense
exports.update = async (req, res) => {
  try {
    const updated = await expenseService.updateExpense(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Expense not found' });
    res.json(updated);
  } catch (err) {
    console.error('Expense/update error:', err);
    res.status(400).json({ error: err.message });
  }
};

// Delete expense
exports.remove = async (req, res) => {
  try {
    const result = await expenseService.deleteExpense(req.params.id);
    if (!result) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Expense/remove error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get monthly payroll expense data
exports.getMonthlyPayrollExpense = async (req, res) => {
  try {
    const { month, year } = req.body;
    
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }
    
    // Process the expense data in one go
    const expense = await expenseService.recordMonthlyPayrollExpense(
      parseInt(month),
      parseInt(year)
    );
    
    res.status(201).json(expense);
  } catch (err) {
    console.error('Error getting monthly payroll expense:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get monthly vendor bills and record them as expenses
exports.getMonthlyVendorBills = async (req, res) => {
  try {
    const { month, year } = req.body;
    
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }
    
    // Process the vendor bills data and create expenses
    const result = await expenseService.recordMonthlyVendorBills(
      parseInt(month),
      parseInt(year)
    );
    
    res.status(201).json(result);
  } catch (err) {
    console.error('Error getting monthly vendor bills:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all individual vendor expenses for a specific month
exports.getMonthlyVendorExpenses = async (req, res) => {
  try {
    const { month, year } = req.body;
    
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }
    
    // Get all individual vendor expenses for the month
    const vendorExpenses = await expenseService.getMonthlyVendorExpenses(
      parseInt(month),
      parseInt(year)
    );
    
    res.json(vendorExpenses);
  } catch (err) {
    console.error('Error getting monthly vendor expenses:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all expenses for a specific month
exports.getMonthlyExpenses = async (req, res) => {
  try {
    const { month, year } = req.body;
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }
    // Ensure payroll expense is recorded before fetching expenses
    try {
      await expenseService.recordMonthlyPayrollExpense(month, year);
    } catch (err) {
      // Log but do not block the response if payroll already exists or fails
      console.warn('Payroll aggregation warning:', err.message);
    }
    const expenses = await expenseService.getExpensesByMonthYear(month, year);
    res.json(expenses);
  } catch (err) {
    console.error('Error getting monthly expenses:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all expenses for a specific month
exports.getAllMonthlyExpenses = async (req, res) => {
  try {
    const { month, year } = req.body;
    
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }
    
    // Start of month
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    // Start of next month
    const endDate = new Date(parseInt(year), parseInt(month), 1);
    
    const filter = {
      date: {
        $gte: startDate,
        $lt: endDate
      }
    };

    // Get all expenses for the month
    const expenses = await expenseService.getFilteredExpenses(filter);
    
    // Calculate total
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Group expenses by type
    const expensesByType = expenses.reduce((acc, expense) => {
      if (!acc[expense.type]) {
        acc[expense.type] = [];
      }
      acc[expense.type].push(expense);
      return acc;
    }, {});
    
    res.json({
      month,
      year,
      totalAmount,
      expensesByType,
      expenses
    });
  } catch (err) {
    console.error('Error getting monthly expenses:', err);
    res.status(500).json({ error: err.message });
  }
};