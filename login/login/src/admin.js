import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [timelogs, setTimelogs] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [showForm, setShowForm] = useState(false);

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

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const renderAddForm = () => {
    switch (activeTab) {
      case 'employees':
        return <AddEmployeeForm />;
      case 'payrolls':
        return <AddPayrollForm />;
      case 'timelogs':
        return <AddTimeLogForm />;
      case 'vendors':
        return <AddVendorForm />;
      case 'expenses':
        return <AddExpenseForm />;
      case 'addClient':
        return <AddClientForm />;
      case 'addProject':
        return <AddProjectForm />;
      default:
        return null;
    }
  };

  const renderTable = () => {
    let columns = [], rows = [];

    switch (activeTab) {
      case 'employees':
        columns = ['Name', 'Email', 'Role', 'Base Salary', 'Salary Type', 'Active'];
        rows = employees.map(emp => [
          emp.name,
          emp.email,
          emp.role,
          formatCurrency(emp.base_salary),
          emp.salary_type,
          emp.active ? 'Yes' : 'No',
        ]);
        break;
      case 'payrolls':
        columns = ['Employee ID', 'Month', 'Year', 'Base Salary', 'Bonus', 'Deductions', 'Status'];
        rows = payrolls.map(p => [
          p.employeeId,
          p.month,
          p.year,
          formatCurrency(p.baseSalary),
          formatCurrency(p.bonus),
          formatCurrency(p.deductions),
          p.status,
        ]);
        break;
      case 'timelogs':
        columns = ['Employee ID', 'Project ID', 'Date', 'Hours Worked'];
        rows = timelogs.map(log => [
          log.employee_id,
          log.project_id,
          formatDate(log.date),
          log.hours_worked,
        ]);
        break;
      case 'vendors':
        columns = ['Vendor ID', 'Name', 'Service Type', 'Address', 'Website', 'Contact', 'Email', 'POC Name', 'POC Email', 'POC Phone', 'GST No', 'PAN No', 'Monthly Charges', 'Active', 'Created At'];
        rows = vendors.map(v => [
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
        ]);
        break;
      case 'expenses':
        columns = ['Type', 'Description', 'Amount (₹)', 'Date'];
        rows = expenses.map(exp => [
          exp.type,
          exp.description,
          formatCurrency(exp.amount),
          formatDate(exp.date),
        ]);
        break;
      default:
        return null;
    }

    return (
      <>
        <div style={styles.toolbar}>
          <button onClick={toggleForm} style={styles.actionBtn}>Add</button>
          <button style={styles.actionBtn}>Remove</button>
        </div>
        {showForm && <div style={{ marginBottom: '1rem' }}>{renderAddForm()}</div>}
        <DataTable title={activeTab.toUpperCase()} columns={columns} rows={rows} />
      </>
    );
  };

  return (
    <div style={styles.wrapper}>
      <aside style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Reports</h2>
        {['employees', 'payrolls', 'timelogs', 'vendors', 'expenses', 'addClient', 'addProject'].map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setShowForm(false); }}
            style={{
              ...styles.navItem,
              backgroundColor: activeTab === tab ? '#1565c0' : 'transparent',
              color: activeTab === tab ? '#fff' : '#333',
            }}
          >
            {tab.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </button>
        ))}
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
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} style={styles.th}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {row.map((cell, i) => (
                <td key={i} style={styles.td}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AddEmployeeForm() {
  return (
    <form style={styles.section}>
      <h3>Add Employee</h3>
      <input placeholder="Name" style={styles.input} />
      <input placeholder="Email" style={styles.input} />
      <input placeholder="Role" style={styles.input} />
      <input placeholder="Base Salary" type="number" style={styles.input} />
      <input placeholder="Salary Type" style={styles.input} />
      <button style={styles.submitBtn}>Submit</button>
    </form>
  );
}

function AddPayrollForm() {
  return (
    <form style={styles.section}>
      <h3>Add Payroll</h3>
      <input placeholder="Employee ID" style={styles.input} />
      <input placeholder="Month" style={styles.input} />
      <input placeholder="Year" style={styles.input} />
      <input placeholder="Base Salary" type="number" style={styles.input} />
      <input placeholder="Bonus" type="number" style={styles.input} />
      <input placeholder="Deductions" type="number" style={styles.input} />
      <button style={styles.submitBtn}>Submit</button>
    </form>
  );
}

function AddTimeLogForm() {
  return (
    <form style={styles.section}>
      <h3>Add Time Log</h3>
      <input placeholder="Employee ID" style={styles.input} />
      <input placeholder="Project ID" style={styles.input} />
      <input type="date" style={styles.input} />
      <input placeholder="Hours Worked" type="number" style={styles.input} />
      <button style={styles.submitBtn}>Submit</button>
    </form>
  );
}

function AddVendorForm() {
  return (
    <form style={styles.section}>
      <h3>Add Vendor</h3>
      <input placeholder="Name" style={styles.input} />
      <input placeholder="Service Type" style={styles.input} />
      <input placeholder="Contact" style={styles.input} />
      <input placeholder="Email" style={styles.input} />
      <button style={styles.submitBtn}>Submit</button>
    </form>
  );
}

function AddExpenseForm() {
  return (
    <form style={styles.section}>
      <h3>Add Expense</h3>
      <input placeholder="Type" style={styles.input} />
      <input placeholder="Description" style={styles.input} />
      <input placeholder="Amount" type="number" style={styles.input} />
      <input type="date" style={styles.input} />
      <button style={styles.submitBtn}>Submit</button>
    </form>
  );
}

function AddClientForm() {
  return (
    <div style={styles.section}>
      <h2>Add Client</h2>
      <form>
        <input placeholder="Client Name" style={styles.input} />
        <input placeholder="Email" style={styles.input} />
        <input placeholder="Contact Number" style={styles.input} />
        <button style={styles.submitBtn}>Submit</button>
      </form>
    </div>
  );
}

function AddProjectForm() {
  return (
    <div style={styles.section}>
      <h2>Add Project</h2>
      <form>
        <input placeholder="Project Name" style={styles.input} />
        <input placeholder="Client ID" style={styles.input} />
        <input placeholder="Start Date" type="date" style={styles.input} />
        <button style={styles.submitBtn}>Submit</button>
      </form>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    fontFamily: 'Arial, sans-serif',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  sidebar: {
    width: '220px',
    backgroundColor: '#e3f2fd',
    padding: '20px',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
  },
  sidebarTitle: {
    fontSize: '18px',
    marginBottom: '20px',
    color: '#1565c0',
  },
  navItem: {
    display: 'block',
    width: '100%',
    padding: '10px 15px',
    textAlign: 'left',
    border: 'none',
    background: 'none',
    fontSize: '15px',
    marginBottom: '5px',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
  },
  main: {
    flexGrow: 1,
    padding: '30px',
    overflowY: 'auto',
  },
  pageHeader: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#1565c0',
  },
  section: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '6px',
    boxShadow: '0 0 8px rgba(0,0,0,0.05)',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '20px',
    marginBottom: '15px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#eeeeee',
    padding: '10px',
    border: '1px solid #ccc',
    textAlign: 'left',
  },
  td: {
    padding: '10px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '10px',
    marginBottom: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  submitBtn: {
    backgroundColor: '#1565c0',
    color: '#fff',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '10px',
  },
  actionBtn: {
    backgroundColor: '#1565c0',
    color: '#fff',
    padding: '8px 12px',
    marginLeft: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default App;
