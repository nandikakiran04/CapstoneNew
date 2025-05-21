import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
// Importing useNavigate from react-router-dom

function App() {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook to navigate to detail pages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/expenses/months-expense', {
        month: parseInt(month),
        year: parseInt(year),
      });
      setExpenses(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch expense data. Please check the server.');
    }
  };

  const handleClear = () => {
    setMonth('');
    setYear('');
    setExpenses([]);
    setError('');
  };

  const handleDetailClick = async (type, expenseId, vendorId) => {
    try {
      if (type === 'payroll') {
        const response = await axios.get(`http://localhost:5004/api/payrolls/month-year/${month}/${year}`);
        navigate('/payrolldetails', { state: { payrolls: response.data, expenseId, month, year } });
      } else if (type === 'vendor') {
        const response = await axios.get(`http://localhost:5000/api/vendors/${vendorId}/bills`);
        navigate('/vendordetails', { state: { vendorBills: response.data, vendorId, expenseId } });
      }
    } catch (error) {
      console.error(`Error fetching ${type} details:`, error);
      setError(`Failed to fetch ${type} details.`);
    }
  };
  
  

  const formatCurrency = (num) =>
    Number(num).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN');
  };

  const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Expenses Dashboard</h1>
      </header>

      <main style={styles.main}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="number"
            placeholder="Month (1-12)"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>Submit</button>
          <button type="button" onClick={handleClear} style={styles.clearButton}>Clear</button>
        </form>

        {error && <p style={styles.error}>{error}</p>}

        {expenses.length > 0 && (
          <section style={styles.resultSection}>
            <h2 style={styles.sectionTitle}>Expense Details</h2>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Description</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Amount (₹)</th>
                    
                  </tr>
                </thead>
                <tbody>
  {expenses.map((expense, idx) => (
    <tr
      key={expense._id}
      style={idx % 2 === 0 ? styles.rowEven : styles.rowOdd}
    >
      <td style={styles.td}>{expense.type}</td>
      <td style={styles.td}>{expense.description}</td>
      <td style={styles.td}>{formatDate(expense.date)}</td>
      <td style={styles.tdRight}>
        {formatCurrency(expense.amount)}
        {(expense.type === 'payroll' || expense.type === 'vendor') && (
          <button
            onClick={() => handleDetailClick(expense.type, expense._id, expense.vendorId)}
            style={styles.detailButton}
          >
            View Details
          </button>
        )}
      </td>
    </tr>
  ))}
</tbody>

              </table>
            </div>
            <div style={styles.totalRow}>
              Total Expenses: ₹{formatCurrency(totalAmount)}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

const styles = {
  wrapper: {
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f4f6f8',
    minHeight: '100vh',
  },
  header: {
    backgroundColor: '#1976d2',
    color: '#fff',
    padding: '1.5rem 2rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  headerTitle: {
    margin: 0,
    fontSize: '1.75rem',
  },
  main: {
    maxWidth: '1100px',
    margin: '2rem auto',
    padding: '0 2rem',
  },
  form: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '2rem',
  },
  input: {
    padding: '0.5rem 0.75rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    minWidth: '150px',
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  clearButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
  },
  resultSection: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    backgroundColor: '#f0f0f0',
    borderBottom: '1px solid #ddd',
    whiteSpace: 'nowrap',
  },
  thRight: {
    textAlign: 'left',
    padding: '12px',
    backgroundColor: '#f0f0f0',
    borderBottom: '1px solid #ddd',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #eee',
  },
  tdRight: {
    padding: '12px',
    textAlign: 'right',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',  // Ensures button and amount are spaced properly
    alignItems: 'center',
  },
  
  rowEven: {
    backgroundColor: '#ffffff',
  },
  rowOdd: {
    backgroundColor: '#f9f9f9',
  },
  totalRow: {
    textAlign: 'right',
    fontWeight: '600',
    fontSize: '1.1rem',
    marginTop: '1rem',
  },
};

export default App;
