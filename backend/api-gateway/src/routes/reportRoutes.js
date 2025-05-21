const express = require('express');
const router = express.Router();
const axios = require('axios');

const REPORTS_SERVICE_URL = process.env.REPORTS_SERVICE_URL || 'http://localhost:5010';

router.post('/monthly-financial', async (req, res) => {
    try {
        const response = await axios.post(`${REPORTS_SERVICE_URL}/api/reports/monthly-financial`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/monthly-financial', async (req, res) => {
    try {
        const response = await axios.post(`${REPORTS_SERVICE_URL}/api/reports/monthly-financial`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;