const express = require('express');
const axios = require('axios');
const router = express.Router();

const PROJECT_SERVICE = 'http://localhost:5002/api/projects';

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(PROJECT_SERVICE);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Project service error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const response = await axios.post(PROJECT_SERVICE, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create project' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${PROJECT_SERVICE}/${req.params.id}`);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error(`Project Service Error [DELETE /${req.params.id}]`, err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// New endpoint for calculating monthly retainer income
router.post('/monthly-income', async (req, res) => {
  try {
    const response = await axios.post(`${PROJECT_SERVICE}/monthly-income`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to calculate monthly income' });
  }
});

module.exports = router;
