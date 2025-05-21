const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.post('/monthly-financial', reportController.generateMonthlyFinancialReport);

module.exports = router;