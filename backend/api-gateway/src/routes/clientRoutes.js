const express = require('express');
const axios = require('axios');
const router = express.Router();

const CLIENT_SERVICE = 'http://localhost:5003/api/clients';

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(CLIENT_SERVICE);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Client service error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const response = await axios.post(CLIENT_SERVICE, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create client' });
  }
 
});

router.delete('/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${CLIENT_SERVICE}/${req.params.id}`);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error(`Client Service Error [DELETE /${req.params.id}]`, err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

module.exports = router;
