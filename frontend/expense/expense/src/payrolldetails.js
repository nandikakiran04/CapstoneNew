import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PayrollDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.data) {
    return <p>No payroll data found.</p>;
  }

  const payroll = state.data;

  return (
    <div style={styles.container}>
      <h2>Payroll Details</h2>
      <div style={styles.card}>
        <p><strong>ID:</strong> {payroll._id}</p>
        <p><strong>Employee ID:</strong> {payroll.employeeId}</p>
        <p><strong>Month:</strong> {payroll.month}</p>
        <p><strong>Year:</strong> {payroll.year}</p>
        <p><strong>Base Salary:</strong> ₹{payroll.baseSalary}</p>
        <p><strong>Bonus:</strong> ₹{payroll.bonus}</p>
        <p><strong>Deductions:</strong> ₹{payroll.deductions}</p>
        <p><strong>Status:</strong> {payroll.status}</p>
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

export default PayrollDetails;
