import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VendorDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.data) {
    return <p>No vendor data found.</p>;
  }

  const vendor = state.data;

  return (
    <div style={styles.container}>
      <h2>Vendor Bill Details</h2>
      <div style={styles.card}>
        <p><strong>ID:</strong> {vendor._id}</p>
        <p><strong>Vendor ID:</strong> {vendor.vendorId}</p>
        <p><strong>Bill Number:</strong> {vendor.billNumber}</p>
        <p><strong>Amount:</strong> ₹{vendor.amount}</p>
        <p><strong>Description:</strong> {vendor.description}</p>
        <p><strong>Bill Date:</strong> {new Date(vendor.billDate).toLocaleDateString('en-IN')}</p>
        <p><strong>Due Date:</strong> {new Date(vendor.dueDate).toLocaleDateString('en-IN')}</p>
        <p><strong>Recurring:</strong> {vendor.isRecurring ? 'Yes' : 'No'}</p>
        <p><strong>Frequency:</strong> {vendor.frequency}</p>
      </div>
      <button onClick={() => navigate(-1)} style={styles.backButton}>Back</button>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif',
  },
  card: {
    padding: '1.5rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    marginBottom: '1rem',
  },
  backButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};

export default VendorDetails;
