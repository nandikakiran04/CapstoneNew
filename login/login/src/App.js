import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import ExpensesDashboard from './expensesDashboard'; // ✅ Import the ExpensesDashboard component
import PayrollDashboard from './payrollsDahboard'; // ✅ Import the PayrollDashboard component
import Admin from './admin'; // ✅ Import the Admin component (admin.js)
import TimeLogDashboard from './Timelog'; // ✅ Import the TimeLogDashboard component (timeLog.js)

// Login Component
function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = form;

    if (username === 'admin' && password === 'admin123') {
      navigate('/admin');
    } else if (username === 'accountant' && password === 'acc123') {
      navigate('/accountant');
    } else if (username === 'employee' && password === 'emp123') {
      navigate('/employee');  // Navigate to the Employee Dashboard when employee logs in
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Login</button>
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
}

// Accountant Dashboard
function AccountantDashboard() {
  const [view, setView] = useState('dashboard');

  return (
    <div style={styles.page}>
      <h1>Accountant Dashboard</h1>
      {view === 'dashboard' && (
        <div style={styles.buttonGroup}>
          <button style={styles.dashboardButton} onClick={() => setView('expenses')}>
            Expenses
          </button>
          <button style={styles.dashboardButton} onClick={() => setView('payrolls')}>
            Payrolls
          </button>
          <button style={styles.dashboardButton} onClick={() => alert('Reports coming soon!')}>
            Reports
          </button>
        </div>
      )}

      {view === 'expenses' && <ExpensesDashboard />}
      {view === 'payrolls' && <PayrollDashboard />} {/* ✅ Render when selected */}
    </div>
  );
}

// App with Routing
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} /> {/* Render Admin component when admin logs in */}
        <Route path="/accountant" element={<AccountantDashboard />} />
        <Route path="/employee" element={<TimeLogDashboard />} /> {/* Render TimeLogDashboard when employee logs in */}
      </Routes>
    </BrowserRouter>
  );
}

// Shared Styles
const styles = {
  container: {
    padding: '2rem',
    maxWidth: '400px',
    margin: 'auto',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
  },
  page: {
    padding: '2rem',
    textAlign: 'center',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '2rem',
  },
  dashboardButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default App;
