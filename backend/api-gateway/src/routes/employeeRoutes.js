const express = require('express');
const axios = require('axios');
const router = express.Router();

const EMPLOYEE_SERVICE = 'http://localhost:5001/api/employees';

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(EMPLOYEE_SERVICE);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Employee service error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const response = await axios.post(EMPLOYEE_SERVICE, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add employee' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`${EMPLOYEE_SERVICE}/${req.params.id}`);
    res.json(response.data);
  } catch (err) {
    res.status(404).json({ message: 'Employee not found' });
  }
});

module.exports = router;
