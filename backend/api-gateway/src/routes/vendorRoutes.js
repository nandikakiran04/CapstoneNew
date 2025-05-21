const express = require('express');
const axios = require('axios');
const router = express.Router();

// Base URL of your Vendor service
const VENDOR_SERVICE_URL = 'http://localhost:5007/api/vendors';

// Create a new vendor
router.post('/', async (req, res) => {
  try {
    const response = await axios.post(VENDOR_SERVICE_URL, req.body);
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500)
      .json({ error: err.response?.data?.error || 'Vendor service error' });
  }
});

// Get all vendors
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(VENDOR_SERVICE_URL);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Vendor service error' });
  }
});

// Get a single vendor by ID
router.get('/:vendorid', async (req, res) => {
  try {
    const response = await axios.get(`${VENDOR_SERVICE_URL}/${req.params.vendorid}`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500)
      .json({ error: err.response?.data?.error || 'Vendor service error' });
  }
});

// Update a vendor by ID
router.put('/:vendorid', async (req, res) => {
  try {
    const response = await axios.put(`${VENDOR_SERVICE_URL}/${req.params.vendorid}`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500)
      .json({ error: err.response?.data?.error || 'Vendor service error' });
  }
});

// Delete a vendor by ID
router.delete('/:vendorid', async (req, res) => {
  try {
    const response = await axios.delete(`${VENDOR_SERVICE_URL}/${req.params.vendorid}`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500)
      .json({ error: err.response?.data?.error || 'Vendor service error' });
  }
});

// Record a payment to this vendor (and push an expense)
router.post('/:id/payments', async (req, res) => {
  try {
    const response = await axios.post(
      `${VENDOR_SERVICE_URL}/${req.params.id}/payments`,
      req.body
    );
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500)
      .json({ error: err.response?.data?.error || 'Vendor payment error' });
  }
});

// Get monthly vendor bills
router.post('/monthly-bills', async (req, res) => {
  try {
    const response = await axios.post(`${VENDOR_SERVICE_URL}/monthly-bills`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500)
      .json({ error: err.response?.data?.error || 'Monthly bills error' });
  }
});

// Vendor-specific bill routes

// Create a bill for a vendor
router.post('/:vendorId/bills', async (req, res) => {
  try {
    const response = await axios.post(
      `${VENDOR_SERVICE_URL}/${req.params.vendorId}/bills`,
      req.body
    );
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500)
      .json({ error: err.response?.data?.error || 'Create bill error' });
  }
});

// Get all bills for a vendor
router.get('/:vendorId/bills', async (req, res) => {
  try {
    const response = await axios.get(
      `${VENDOR_SERVICE_URL}/${req.params.vendorId}/bills`
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500)
      .json({ error: err.response?.data?.error || 'Get bills error' });
  }
});

// Get a single bill by billId
router.get('/bills/:billId', async (req, res) => {
  try {
    const response = await axios.get(
      `${VENDOR_SERVICE_URL}/bills/${req.params.billId}`
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500)
      .json({ error: err.response?.data?.error || 'Get bill error' });
  }
});

// Update a bill by billId
router.put('/bills/:billId', async (req, res) => {
  try {
    const response = await axios.put(
      `${VENDOR_SERVICE_URL}/bills/${req.params.billId}`,
      req.body
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500)
      .json({ error: err.response?.data?.error || 'Update bill error' });
  }
});

// Delete a bill by billId
router.delete('/bills/:billId', async (req, res) => {
  try {
    const response = await axios.delete(
      `${VENDOR_SERVICE_URL}/bills/${req.params.billId}`
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500)
      .json({ error: err.response?.data?.error || 'Delete bill error' });
  }
});

// Pay a bill by billId
router.post('/bills/:billId/pay', async (req, res) => {
  try {
    const response = await axios.post(
      `${VENDOR_SERVICE_URL}/bills/${req.params.billId}/pay`,
      req.body
    );
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500)
      .json({ error: err.response?.data?.error || 'Pay bill error' });
  }
});

module.exports = router;
