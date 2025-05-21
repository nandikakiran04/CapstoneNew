const express = require('express');
const router = express.Router();
const vendorController = require('../controller/vendorController');
const vendorBillController = require('../controller/vendorBillController');

// Create a new vendor
router.post('/', vendorController.createVendor);

// Get all vendors
router.get('/', vendorController.getAllVendors);

// Get a single vendor
router.get('/:vendorId', vendorController.getVendorById);

// Update a vendor
router.put('/:vendorId', vendorController.updateVendor);

// Delete a vendor
router.delete('/:vendorId', vendorController.deleteVendor);

// Get monthly bills
router.post('/monthly-bills', vendorBillController.getMonthlyVendorBills);

// Vendor-specific bill routes
router.post('/:vendorId/bills', vendorBillController.createVendorBill);
router.get('/:vendorId/bills', vendorBillController.getVendorBills);
router.get('/bills/:billId', vendorBillController.getVendorBillById);
router.put('/bills/:billId', vendorBillController.updateVendorBill);
router.delete('/bills/:billId', vendorBillController.deleteVendorBill);

module.exports = router;


