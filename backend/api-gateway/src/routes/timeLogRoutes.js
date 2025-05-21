// File: api-gateway/src/routes/timeLogRoutes.js
const express = require('express');
const axios   = require('axios');
const router  = express.Router();

// Base URL of your TimeLog service
const TIMELOG_SERVICE = 'http://localhost:5006/api/timelogs';

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(TIMELOG_SERVICE, { params: req.query });
    res.json(response.data);
  } catch (err) {
    console.error('TimeLog Service Error [GET /]', err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const response = await axios.post(TIMELOG_SERVICE, req.body);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error('TimeLog Service Error [POST /]', err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

router.post('/bulk', async (req, res) => {
  try {
    const response = await axios.post(`${TIMELOG_SERVICE}/bulk`, req.body);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error('TimeLog Service Error [POST /bulk]', err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`${TIMELOG_SERVICE}/${req.params.id}`);
    res.json(response.data);
  } catch (err) {
    console.error(`TimeLog Service Error [GET /${req.params.id}]`, err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const response = await axios.put(`${TIMELOG_SERVICE}/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (err) {
    console.error(`TimeLog Service Error [PUT /${req.params.id}]`, err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${TIMELOG_SERVICE}/${req.params.id}`);
    res.json(response.data);
  } catch (err) {
    console.error(`TimeLog Service Error [DELETE /${req.params.id}]`, err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

module.exports = router;
