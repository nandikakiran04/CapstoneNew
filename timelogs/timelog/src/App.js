import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TimeLogDashboard() {
  const [form, setForm] = useState({
    employee_id: '',
    project_id: '',
    date: '',
    hours_worked: '',
  });
  const [timelogs, setTimelogs] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchTimelogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/timelogs');
      setTimelogs(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch time logs.');
    }
  };

  useEffect(() => {
    fetchTimelogs();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      await axios.post('http://localhost:5000/api/timelogs', {
        ...form,
        hours_worked: parseFloat(form.hours_worked),
      });
      setForm({ employee_id: '', project_id: '', date: '', hours_worked: '' });
      setSuccess('Time log added successfully.');
      fetchTimelogs();
    } catch (err) {
      console.error(err);
      setError('Failed to submit time log.');
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN');

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Time Log Dashboard</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="employee_id"
          placeholder="Employee ID"
          value={form.employee_id}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="text"
          name="project_id"
          placeholder="Project ID"
          value={form.project_id}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="number"
          name="hours_worked"
          placeholder="Hours Worked"
          value={form.hours_worked}
          onChange={handleChange}
          style={styles.input}
          min="0"
          step="0.1"
          required
        />
        <button type="submit" style={styles.button}>Submit</button>
      </form>

      {success && <p style={styles.success}>{success}</p>}
      {error && <p style={styles.error}>{error}</p>}

      {timelogs.length > 0 && (
        <div style={styles.tableWrapper}>
          <h2 style={styles.subHeader}>Submitted Time Logs</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Employee ID</th>
                <th style={styles.th}>Project ID</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Hours Worked</th>
              </tr>
            </thead>
            <tbody>
              {timelogs.map((log, index) => (
                <tr key={log._id} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                  <td style={styles.td}>{log.employee_id}</td>
                  <td style={styles.td}>{log.project_id}</td>
                  <td style={styles.td}>{formatDate(log.date)}</td>
                  <td style={styles.tdRight}>{log.hours_worked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Segoe UI, sans-serif',
    padding: '2rem',
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
  },
  header: {
    fontSize: '2rem',
    color: '#1976d2',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: '1.25rem',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '2rem',
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  input: {
    flex: '1 1 200px',
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  success: {
    color: 'green',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  tableWrapper: {
    overflowX: 'auto',
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#f0f0f0',
    padding: '12px',
    borderBottom: '1px solid #ccc',
    textAlign: 'left',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #eee',
  },
  tdRight: {
    padding: '12px',
    textAlign: 'right',
    borderBottom: '1px solid #eee',
  },
  rowEven: {
    backgroundColor: '#ffffff',
  },
  rowOdd: {
    backgroundColor: '#f9f9f9',
  },
};

export default TimeLogDashboard;
