const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    year: {
        type: Number,
        required: true
    },
    income: {
        retainerIncome: Number,
        totalIncome: Number
    },
    expenses: {
        payrollExpenses: Number,
        vendorExpenses: Number,
        totalExpenses: Number
    },
    summary: {
        totalIncome: Number,
        totalExpenses: Number,
        netIncome: Number
    },
    generatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Report', reportSchema);