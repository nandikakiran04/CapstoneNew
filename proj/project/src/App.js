import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProjectDashboard() {
  const [form, setForm] = useState({
    name: '',
    client_id: '',
    project_manager: '',
    start_date: '',
    end_date: '',
    billing_type: 'fixed',
    total_amount: '',
    assigned_employees: '',
    employee_count: '',
    status: 'active',
    monthlyRetainer: ''
  });

  const [projects, setProjects] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/projects');
      setProjects(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch projects.');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      await axios.post('http://localhost:5000/api/projects', {
        ...form,
        total_amount: parseFloat(form.total_amount),
        employee_count: parseInt(form.employee_count),
        monthlyRetainer: parseFloat(form.monthlyRetainer),
        assigned_employees: form.assigned_employees.split(',').map(emp => emp.trim())
      });
      setForm({
        name: '',
        client_id: '',
        project_manager: '',
        start_date: '',
        end_date: '',
        billing_type: 'fixed',
        total_amount: '',
        assigned_employees: '',
        employee_count: '',
        status: 'active',
        monthlyRetainer: ''
      });
      setSuccess('Project added successfully.');
      fetchProjects();
    } catch (err) {
      console.error(err);
      setError('Failed to submit project.');
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN');
  const formatCurrency = (amt) => `₹${amt?.toLocaleString() || 0}`;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Project Dashboard</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" name="name" placeholder="Project Name" value={form.name} onChange={handleChange} style={styles.input} required />
        <input type="text" name="client_id" placeholder="Client ID" value={form.client_id} onChange={handleChange} style={styles.input} required />
        <input type="text" name="project_manager" placeholder="Project Manager (Emp ID)" value={form.project_manager} onChange={handleChange} style={styles.input} required />
        <input type="date" name="start_date" value={form.start_date} onChange={handleChange} style={styles.input} required />
        <input type="date" name="end_date" value={form.end_date} onChange={handleChange} style={styles.input} />
        <select name="billing_type" value={form.billing_type} onChange={handleChange} style={styles.input}>
          <option value="fixed">Fixed</option>
          <option value="hourly">Hourly</option>
        </select>
        <input type="number" name="total_amount" placeholder="Total Amount" value={form.total_amount} onChange={handleChange} style={styles.input} required />
        <input type="text" name="assigned_employees" placeholder="Assigned Employees (comma-separated)" value={form.assigned_employees} onChange={handleChange} style={styles.input} />
        <input type="number" name="employee_count" placeholder="Employee Count" value={form.employee_count} onChange={handleChange} style={styles.input} />
        <select name="status" value={form.status} onChange={handleChange} style={styles.input}>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="on-hold">On-Hold</option>
        </select>
        <input type="number" name="monthlyRetainer" placeholder="Monthly Retainer" value={form.monthlyRetainer} onChange={handleChange} style={styles.input} />
        <button type="submit" style={styles.button}>Submit</button>
      </form>

      {success && <p style={styles.success}>{success}</p>}
      {error && <p style={styles.error}>{error}</p>}

      {projects.length > 0 && (
        <div style={styles.tableWrapper}>
          <h2 style={styles.subHeader}>Projects List</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Client ID</th>
                <th style={styles.th}>Manager</th>
                <th style={styles.th}>Start</th>
                <th style={styles.th}>End</th>
                <th style={styles.th}>Billing</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Employees</th>
                <th style={styles.th}>Count</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Monthly</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj, idx) => (
                <tr key={proj._id} style={idx % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                  <td style={styles.td}>{proj.name}</td>
                  <td style={styles.td}>{proj.client_id}</td>
                  <td style={styles.td}>{proj.project_manager}</td>
                  <td style={styles.td}>{formatDate(proj.start_date)}</td>
                  <td style={styles.td}>{proj.end_date ? formatDate(proj.end_date) : '-'}</td>
                  <td style={styles.td}>{proj.billing_type}</td>
                  <td style={styles.td}>{formatCurrency(proj.total_amount)}</td>
                  <td style={styles.td}>{proj.assigned_employees?.join(', ')}</td>
                  <td style={styles.td}>{proj.employee_count || '-'}</td>
                  <td style={styles.td}>{proj.status}</td>
                  <td style={styles.td}>{formatCurrency(proj.monthlyRetainer)}</td>
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
    flex: '1 1 250px',
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
  rowEven: {
    backgroundColor: '#ffffff',
  },
  rowOdd: {
    backgroundColor: '#f9f9f9',
  },
};

export default ProjectDashboard;
