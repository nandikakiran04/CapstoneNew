import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [timelogs, setTimelogs] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, expRes, timeRes, payRes, vendRes] = await Promise.all([
          axios.get('http://localhost:5000/api/employees'),
          axios.get('http://localhost:5000/api/expenses'),
          axios.get('http://localhost:5000/api/timelogs'),
          axios.get('http://localhost:5000/api/payrolls'),
          axios.get('http://localhost:5000/api/vendors'),
        ]);
        setEmployees(empRes.data);
        setExpenses(expRes.data);
        setTimelogs(timeRes.data);
        setPayrolls(payRes.data);
        setVendors(vendRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return isNaN(d) ? 'Invalid Date' : d.toLocaleDateString('en-IN');
  };

  const formatCurrency = (amount) =>
    typeof amount === 'number' ? `₹${amount.toLocaleString()}` : '₹0';

  const renderTable = () => {
    switch (activeTab) {
      case 'employees':
        return (
          <DataTable
            title="Employees"
            columns={['Name', 'Email', 'Role', 'Base Salary', 'Salary Type', 'Active']}
            rows={employees.map(emp => [
              emp.name,
              emp.email,
              emp.role,
              formatCurrency(emp.base_salary),
              emp.salary_type,
              emp.active ? 'Yes' : 'No',
            ])}
          />
        );
      case 'payrolls':
        return (
          <DataTable
            title="Payrolls"
            columns={['Employee ID', 'Month', 'Year', 'Base Salary', 'Bonus', 'Deductions', 'Status']}
            rows={payrolls.map(p => [
              p.employeeId,
              p.month,
              p.year,
              formatCurrency(p.baseSalary),
              formatCurrency(p.bonus),
              formatCurrency(p.deductions),
              p.status,
            ])}
          />
        );
      case 'timelogs':
        return (
          <DataTable
            title="Time Logs"
            columns={['Employee ID', 'Project ID', 'Date', 'Hours Worked']}
            rows={timelogs.map(log => [
              log.employee_id,
              log.project_id,
              formatDate(log.date),
              log.hours_worked,
            ])}
          />
        );
      case 'vendors':
        return (
          <DataTable
            title="Vendors"
            columns={[
              'Vendor ID', 'Name', 'Service Type', 'Address', 'Website', 'Contact', 'Email',
              'POC Name', 'POC Email', 'POC Phone', 'GST No', 'PAN No', 'Monthly Charges', 'Active', 'Created At'
            ]}
            rows={vendors.map(v => [
              v.vendorId,
              v.name,
              v.serviceType,
              v.address,
              v.website,
              v.contact,
              v.email,
              v.pocName,
              v.pocEmail,
              v.pocPhone,
              v.gstNumber,
              v.panNumber,
              formatCurrency(v.MonthlyCharges),
              v.isActive ? 'Yes' : 'No',
              formatDate(v.createdAt),
            ])}
          />
        );
      case 'expenses':
        return (
          <DataTable
            title="Expenses"
            columns={['Type', 'Description', 'Amount (₹)', 'Date']}
            rows={expenses.map(exp => [
              exp.type,
              exp.description,
              formatCurrency(exp.amount),
              formatDate(exp.date),
            ])}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.wrapper}>
      <aside style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Reports</h2>

        {/* Top Group */}
        <button
          onClick={() => setActiveTab('employees')}
          style={{
            ...styles.navItem,
            backgroundColor: activeTab === 'employees' ? '#1565c0' : 'transparent',
            color: activeTab === 'employees' ? '#fff' : '#333',
          }}
        >
          Employees
        </button>
        <button
          onClick={() => setActiveTab('payrolls')}
          style={{
            ...styles.navItem,
            backgroundColor: activeTab === 'payrolls' ? '#1565c0' : 'transparent',
            color: activeTab === 'payrolls' ? '#fff' : '#333',
          }}
        >
          Payrolls
        </button>

        {/* Spacer */}
        <div style={{ marginTop: '2rem' }} />

        {/* Bottom Group */}
        <button
          onClick={() => setActiveTab('timelogs')}
          style={{
            ...styles.navItem,
            backgroundColor: activeTab === 'timelogs' ? '#1565c0' : 'transparent',
            color: activeTab === 'timelogs' ? '#fff' : '#333',
          }}
        >
          Timelogs
        </button>
        <button
          onClick={() => setActiveTab('vendors')}
          style={{
            ...styles.navItem,
            backgroundColor: activeTab === 'vendors' ? '#1565c0' : 'transparent',
            color: activeTab === 'vendors' ? '#fff' : '#333',
          }}
        >
          Vendors
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          style={{
            ...styles.navItem,
            backgroundColor: activeTab === 'expenses' ? '#1565c0' : 'transparent',
            color: activeTab === 'expenses' ? '#fff' : '#333',
          }}
        >
          Expenses
        </button>
      </aside>
      <main style={styles.main}>
        <h1 style={styles.pageHeader}>Reports Dashboard</h1>
        {renderTable()}
      </main>
    </div>
  );
}

function DataTable({ title, columns, rows }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} style={styles.th}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} style={rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} style={styles.td}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f4f6f8',
    minHeight: '100vh',
  },
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '220px',
    backgroundColor: '#e3f2fd',
    padding: '1rem',
    overflowY: 'auto',
    boxShadow: '2px 0 6px rgba(0,0,0,0.1)',
    zIndex: 1000,
  },
  main: {
    marginLeft: '220px',
    flex: 1,
    padding: '2rem',
  },
  sidebarTitle: {
    fontSize: '1.5rem',
    color: '#1976d2',
    marginBottom: '1rem',
  },
  navItem: {
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    border: 'none',
    backgroundColor: 'transparent',
    textAlign: 'left',
    cursor: 'pointer',
    borderRadius: '4px',
    marginBottom: '0.5rem',
  },
  pageHeader: {
    fontSize: '2rem',
    marginBottom: '2rem',
    color: '#1565c0',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '1.25rem',
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
    backgroundColor: '#f0f0f0',
    padding: '12px',
    borderBottom: '2px solid #ccc',
    textAlign: 'left',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #eee',
  },
  rowEven: {
    backgroundColor: '#fff',
  },
  rowOdd: {
    backgroundColor: '#f9f9f9',
  },
};

export default App;
