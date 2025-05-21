const express           = require('express');
const router            = express.Router();
const expenseController = require('../controllers/expenseController');

// 1) Aggregate payroll expenses for a month
//    MUST come before the `/:id` route
//    e.g. POST /api/expenses/payroll
router.post('/payroll', expenseController.getMonthlyPayrollExpense);

// 2) Aggregate vendor bills for a month
//    MUST come before the `/:id` route
//    e.g. POST /api/expenses/vendor-bills
router.post('/vendor-bills', expenseController.getMonthlyVendorBills);

// 3) Get individual vendor expenses for a month
//    MUST come before the `/:id` route
//    e.g. POST /api/expenses/vendor-expenses
router.post('/months-expense', expenseController.getMonthlyExpenses);

// 4) Dynamic-filter GET
//    e.g. GET /api/expenses?type=vendor&month=5&year=2025
router.get('/', expenseController.getExpenses);

// 5) Create a new expense manually
//    e.g. POST /api/expenses { type, amount, ... }
router.post('/', expenseController.create);

// 6) Get by ID
//    e.g. GET /api/expenses/60af...
router.get('/:id', expenseController.getById);

// 7) Update an existing expense
//    e.g. PUT /api/expenses/60af... { amount, description }
router.put('/:id', expenseController.update);

// 8) Delete an expense
//    e.g. DELETE /api/expenses/60af...
router.delete('/:id', expenseController.remove);

module.exports = router;