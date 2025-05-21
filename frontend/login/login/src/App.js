import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate, Link } from 'react-router-dom';
import ExpensesDashboard from './expensesDashboard';
import PayrollDashboard from './payrollsDahboard';
import Admin from './admin';
import TimeLogDashboard from './Timelog';

function Navbar() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  return (
    <nav style={navStyles.navbar}>
      <div>
        <Link to="/" style={navStyles.logo}>Company Portal</Link>
      </div>
      <div style={navStyles.links}>
        {!currentUser ? (
          <>
            <Link to="/login" style={navStyles.link}>Login</Link>
            <Link to="/signup" style={navStyles.link}>Sign Up</Link>
          </>
        ) : (
          <>
            <span style={navStyles.user}>Hello, {currentUser.username}</span>
            <button onClick={handleLogout} style={navStyles.logoutButton}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

function Landing() {
  const navigate = useNavigate();
  return (
    <div style={styles.landingWrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome to Company Portal</h1>
        <p style={styles.subtitle}>Please choose an option to continue</p>
        <div style={styles.buttonGroup}>
          <button onClick={() => navigate('/login')} style={styles.landingButton}>Login</button>
          <button onClick={() => navigate('/signup')} style={styles.landingButton}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', role: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const exists = users.find((u) => u.username === form.username);
    if (exists) {
      setError('Username already exists');
      return;
    }
    users.push(form);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Signup successful! Please login.');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="username" placeholder="Username" onChange={handleChange} required style={styles.input} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required style={styles.input} />
        <select name="role" onChange={handleChange} required style={styles.input}>
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="accountant">Accountant</option>
          <option value="employee">Employee</option>
        </select>
        <button type="submit" style={styles.button}>Register</button>
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
}

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const found = users.find(
      (u) => u.username === form.username && u.password === form.password
    );
    if (found) {
      localStorage.setItem('currentUser', JSON.stringify(found));
      navigate(`/${found.role}`);
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="username" placeholder="Username" onChange={handleChange} required style={styles.input} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required style={styles.input} />
        <button type="submit" style={styles.button}>Login</button>
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
}

function AccountantDashboard() {
  const [view, setView] = useState('dashboard');

  return (
    <div style={styles.page}>
      <h1>Accountant Dashboard</h1>
      <div style={styles.buttonGroup}>
        <button onClick={() => setView('expenses')} style={styles.dashboardButton}>Expenses</button>
        <button onClick={() => setView('payrolls')} style={styles.dashboardButton}>Payrolls</button>
        <button onClick={() => alert('Reports coming soon!')} style={styles.dashboardButton}>Reports</button>
      </div>
      {view === 'expenses' && <ExpensesDashboard />}
      {view === 'payrolls' && <PayrollDashboard />}
    </div>
  );
}

function ProtectedRoute({ role, children }) {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  return user?.role === role ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={appStyles.appWrapper}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute role="admin"><Admin /></ProtectedRoute>
          } />
          <Route path="/accountant" element={
            <ProtectedRoute role="accountant"><AccountantDashboard /></ProtectedRoute>
          } />
          <Route path="/employee" element={
            <ProtectedRoute role="employee"><TimeLogDashboard /></ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const navStyles = {
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '60px',
    backgroundColor: '#1976d2',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    zIndex: 1000,
  },
  logo: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '1.5rem',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '1rem',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  user: {
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#e53935',
    border: 'none',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
  }
};

const appStyles = {
  appWrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #1e3c72 0%, #2a5298 100%)',
    paddingTop: '60px', // to offset fixed navbar
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#333',
  }
};

const styles = {
  landingWrapper: {
    height: 'calc(100vh - 60px)', // adjust for navbar height
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #6b73ff 0%, #000dff 100%)',
  },
  card: {
    backgroundColor: '#fff',
    padding: '3rem',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
    color: '#333',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '2rem',
  },
  landingButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    margin: '0 0.5rem',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
  container: {
    maxWidth: '400px',
    margin: '4rem auto',
    padding: '2rem',
    backgroundColor: '#f7f9fc',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    marginTop: '1rem',
  },
  input: {
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1.5px solid #ccc',
    transition: 'border-color 0.3s ease',
  },
  button: {
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  error: {
    color: '#d32f2f',
    fontWeight: '600',
    marginTop: '-0.5rem',
  },
  page: {
    padding: '2rem',
    textAlign: 'center',
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
