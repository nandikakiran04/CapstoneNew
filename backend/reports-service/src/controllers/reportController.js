const reportService = require('../services/reportService');

exports.generateMonthlyFinancialReport = async (req, res) => {
    try {
        const { month, year } = req.body;

        if (!month || !year) {
            return res.status(400).json({ message: 'Month and year are required' });
        }

        // Check if report already exists
        let report = await reportService.getMonthlyReport(month, year);

        if (!report) {
            // Generate new report
            report = await reportService.generateMonthlyFinancialReport(month, year);
        }

        res.json(report);
    } catch (error) {
        console.error('Error in generateMonthlyFinancialReport:', error);
        res.status(500).json({ error: error.message });
    }
};