// src/controller/vendorController.js
const mongoose = require('mongoose');
const axios  = require('axios');
const Vendor = require('../model/vendor');

// Create
exports.createVendor = async (req, res) => {
  try {
    const vendor = new Vendor(req.body);
    await vendor.save();
    res.status(201).json(vendor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All
exports.getAllVendors = async (_req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get One by vendorId
exports.getVendorById = async (req, res) => {
  const { vendorId } = req.params;
  try {
    const vendor = await Vendor.findOne({vendorId});
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update by vendorId
exports.updateVendor = async (req, res) => {
  const { vendorId } = req.params;
  try {
    const updates = req.body;
    updates.updatedAt = new Date();
    const vendor = await Vendor.findOneAndUpdate(
      { vendorId: req.params.vendorId  },
      req.body,
      { new: true }
    );
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete by vendorId
exports.deleteVendor = async (req, res) => {
  const { vendorId } = req.params;
  try {
    const vendor = await Vendor.findOneAndDelete({ vendorId });
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    res.json({ message: 'Vendor deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Record a payment (push to Expenses) by vendorId
exports.recordVendorPayment = async (req, res) => {
  const key = req.params.id;
  const { amount, date = new Date().toISOString(), description = '' } = req.body;

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Must provide a positive numeric amount' });
  }

  let vendor;
  // 1) Try Mongo _id
  if (mongoose.Types.ObjectId.isValid(key)) {
    vendor = await Vendor.findById(key);
  }
  // 2) Fallback to custom vendorId
  if (!vendor) {
    vendor = await Vendor.findOne({ vendorId: key });
  }
  if (!vendor) {
    return res.status(404).json({ error: 'Vendor not found' });
  }

  try {
    // 3) Push to Expenses MS
    const EXPENSES_URL = 'http://localhost:5000/api/expenses'; // gateway URL
    const payload = {
      type:        'vendor',
      amount,
      description: description || `Payment to vendor ${vendor.name}`,
      date,
      vendor_id:   vendor.vendorId || vendor._id.toString()
    };

    const { data, status } = await axios.post(EXPENSES_URL, payload);
    return res.status(status).json(data);

  } catch (err) {
    console.error('recordVendorPayment error:', err.response?.data || err.message);
    const status = err.response?.status || 500;
    return res.status(status).json({ error: err.response?.data || err.message });
  }
};