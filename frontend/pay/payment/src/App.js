import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/payrolls/calculate', {
        month: parseInt(month),
        year: parseInt(year),
      });
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch payroll data. Please check the server.');
    }
  };

  const handleClear = () => {
    setMonth('');
    setYear('');
    setData(null);
    setError('');
  };

  const formatCurrency = (num) =>
    Number(num).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Payroll Dashboard</h1>
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

        {data?.payrolls?.length > 0 && (
          <section style={styles.resultSection}>
            <h2 style={styles.sectionTitle}>Payroll Details</h2>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Employee ID</th>
                    <th style={styles.th}>Month</th>
                    <th style={styles.th}>Year</th>
                    <th style={styles.thRight}>Base Salary</th>
                    <th style={styles.thRight}>Bonus</th>
                    <th style={styles.thRight}>Deductions</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.thRight}>Final Salary</th>
                    <th style={styles.thRight}>Hours</th>
                    <th style={styles.thRight}>Regular</th>
                    <th style={styles.thRight}>Overtime</th>
                  </tr>
                </thead>
                <tbody>
                  {data.payrolls.map((emp, idx) => (
                    <tr key={idx} style={idx % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                      <td style={styles.td}>{emp.employeeId.slice(0, 6)}…</td>
                      <td style={styles.tdCenter}>{emp.month}</td>
                      <td style={styles.tdCenter}>{emp.year}</td>
                      <td style={styles.tdRight}>{formatCurrency(emp.baseSalary)}</td>
                      <td style={styles.tdRight}>{formatCurrency(emp.bonus)}</td>
                      <td style={styles.tdRight}>{formatCurrency(emp.deductions)}</td>
                      <td style={styles.tdCenter}>
                        <span style={emp.status === 'unpaid' ? styles.statusUnpaid : styles.statusPaid}>
                          {emp.status}
                        </span>
                      </td>
                      <td style={styles.tdRight}>{formatCurrency(emp.finalSalary)}</td>
                      <td style={styles.tdRight}>{emp.hoursWorked}</td>
                      <td style={styles.tdRight}>{emp.regularHours}</td>
                      <td style={styles.tdRight}>{emp.overtimeHours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={styles.totalRow}>
              Total Amount: ₹{formatCurrency(data.totalAmount)}
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
    textAlign: 'right',
    padding: '12px',
    backgroundColor: '#f0f0f0',
    borderBottom: '1px solid #ddd',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #eee',
  },
  tdCenter: {
    padding: '12px',
    textAlign: 'center',
    borderBottom: '1px solid #eee',
  },
  tdRight: {
    padding: '12px',
    textAlign: 'right',
    borderBottom: '1px solid #eee',
  },
  totalRow: {
    textAlign: 'right',
    fontWeight: '600',
    fontSize: '1.1rem',
    marginTop: '1rem',
  },
  statusPaid: {
    color: 'green',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  statusUnpaid: {
    color: 'red',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  rowEven: {
    backgroundColor: '#ffffff',
  },
  rowOdd: {
    backgroundColor: '#f9f9f9',
  },
};

export default App;
