import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [timelogs, setTimelogs] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, expRes, timeRes, payRes, vendRes,  projRes,
            clientRes,] = await Promise.all([
          axios.get('http://localhost:5000/api/employees'),
          axios.get('http://localhost:5000/api/expenses'),
          axios.get('http://localhost:5000/api/timelogs'),
          axios.get('http://localhost:5000/api/payrolls'),
          axios.get('http://localhost:5000/api/vendors'),
          axios.get('http://localhost:5000/api/projects'),
          axios.get('http://localhost:5000/api/clients'),
        ]);
        setEmployees(empRes.data);
        setExpenses(expRes.data);
        setTimelogs(timeRes.data);
        setPayrolls(payRes.data);
        setVendors(vendRes.data);
        setProjects(projRes.data);
        setClients(clientRes.data);
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
        return <AddEmployeeForm onSuccess={(newEmp) => setEmployees(prev => [...prev, newEmp])} />;
      case 'payrolls':
        return <AddPayrollForm />;
      case 'timelogs':
        return <AddTimeLogForm />;
      case 'vendors':
        return <AddVendorForm />;
      case 'expenses':
        return <AddExpenseForm />;
      case 'projects':
            return <AddProjectForm  />;
          case 'clients':
            return <AddClientForm />;
      default:
        return null;
    }
  };

  const renderTable = () => {
    let columns = [], rows = [];

    switch (activeTab) {
      case 'employees':
        columns = ['Name', 'Email', 'Role', 'Base Salary', 'Salary Type', 'Active'];
        rows = employees
        .filter(emp => emp && emp.name) // skip undefined or invalid employees
        .map(emp => [
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
        case 'projects':
  columns = [
    'Name',
    'Client ID',
    'Project Manager',
    'Start Date',
    'End Date',
    'Billing Type',
    'Total Amount (₹)',
    'Assigned Employees',
    'Employee Count',
    'Status',
    'Monthly Retainer (₹)',
  ];
  rows = projects.map(project => [
    project.name,
    project.client_id,
    project.project_manager,
    formatDate(project.start_date),
    formatDate(project.end_date),
    project.billing_type,
    formatCurrency(project.total_amount),
    Array.isArray(project.assigned_employees) ? project.assigned_employees.join(', ') : '',
    project.employee_count,
    project.status,
    formatCurrency(project.monthlyRetainer),
  ]);
  break;

case 'clients':
  columns = [
    'Name',
    'Industry',
    'Address',
    'POC Name',
    'POC Email',
    'POC Phone',
    'Status',
  ];
  rows = clients.map(client => [
    client.name,
    client.industry,
    client.address,
    client.poc_name,
    client.poc_email,
    client.poc_phone,
    client.status,
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
        {['employees', 'payrolls', 'timelogs', 'vendors', 'expenses','projects',
          'clients'].map(tab => (
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


function AddEmployeeForm({ onSuccess }) {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      role: '',
      base_salary: '',
      salary_type: '',
      active: true,
    });
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const payload = {
          ...formData,
          base_salary: Number(formData.base_salary) || 0,
          role: formData.role.trim(),
          salary_type: formData.salary_type.trim().toLowerCase(),
        };
  
        await axios.post('http://localhost:5000/api/employees', payload);
        alert('Employee added successfully!');
        if (onSuccess) onSuccess();
  
        setFormData({
          name: '',
          email: '',
          role: '',
          base_salary: '',
          salary_type: '',
          active: true,
        });
      } catch (error) {
        console.error('Error adding employee:', error);
        alert('Failed to add employee. Check console for details.');
      }
    };
  
    return (
      <form style={styles.section} onSubmit={handleSubmit}>
        <h3>Add Employee</h3>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          style={styles.input}
          required
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          style={styles.input}
          type="email"
          required
        />
        <input
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="Role"
          style={styles.input}
          required
        />
        <input
          name="base_salary"
          value={formData.base_salary}
          onChange={handleChange}
          placeholder="Base Salary"
          type="number"
          style={styles.input}
          required
        />
        <input
          name="salary_type"
          value={formData.salary_type}
          onChange={handleChange}
          placeholder="Salary Type (monthly/hourly)"
          style={styles.input}
          required
        />
        <label style={{ marginBottom: '1rem', display: 'block' }}>
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleChange}
          />{' '}
          Active
        </label>
        <button type="submit" style={styles.submitBtn}>
          Submit
        </button>
      </form>
    );
  }
  

// All other forms remain unchanged

function AddPayrollForm({ onSuccess }) {
    const [formData, setFormData] = useState({
      employeeId: '',
      month: '',
      year: '',
      baseSalary: '',
      bonus: '',
      deductions: '',
      status: '',
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        // Prepare payload: convert numbers, trim strings
        const payload = {
          employeeId: formData.employeeId.trim(),
          month: formData.month.trim(),
          year: Number(formData.year) || new Date().getFullYear(),
          baseSalary: Number(formData.baseSalary) || 0,
          bonus: Number(formData.bonus) || 0,
          deductions: Number(formData.deductions) || 0,
          status: formData.status.trim(),
        };
  
        await axios.post('http://localhost:5000/api/payrolls', payload);
        alert('Payroll added successfully!');
        if (onSuccess) onSuccess();
  
        setFormData({
          employeeId: '',
          month: '',
          year: '',
          baseSalary: '',
          bonus: '',
          deductions: '',
          status: '',
        });
      } catch (error) {
        console.error('Error adding payroll:', error);
        alert('Failed to add payroll. Check console for details.');
      }
    };
  
    return (
      <form style={styles.section} onSubmit={handleSubmit}>
        <h3>Add Payroll</h3>
        <input
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          placeholder="Employee ID"
          style={styles.input}
          required
        />
        <input
          name="month"
          value={formData.month}
          onChange={handleChange}
          placeholder="Month (e.g. January)"
          style={styles.input}
          required
        />
        <input
          name="year"
          value={formData.year}
          onChange={handleChange}
          placeholder="Year (e.g. 2025)"
          type="number"
          style={styles.input}
          required
        />
        <input
          name="baseSalary"
          value={formData.baseSalary}
          onChange={handleChange}
          placeholder="Base Salary"
          type="number"
          style={styles.input}
          required
        />
        <input
          name="bonus"
          value={formData.bonus}
          onChange={handleChange}
          placeholder="Bonus"
          type="number"
          style={styles.input}
        />
        <input
          name="deductions"
          value={formData.deductions}
          onChange={handleChange}
          placeholder="Deductions"
          type="number"
          style={styles.input}
        />
        <input
          name="status"
          value={formData.status}
          onChange={handleChange}
          placeholder="Status (e.g. Paid/Pending)"
          style={styles.input}
          required
        />
        <button type="submit" style={styles.submitBtn}>
          Submit
        </button>
      </form>
    );
  }

  function AddTimeLogForm({ onSuccess }) {
    const [formData, setFormData] = useState({
      employee_id: '',
      project_id: '',
      date: '',
      hours_worked: '',
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const payload = {
          employee_id: formData.employee_id.trim(),
          project_id: formData.project_id.trim(),
          date: formData.date, // date input gives ISO format by default
          hours_worked: Number(formData.hours_worked) || 0,
        };
  
        await axios.post('http://localhost:5000/api/timelogs', payload);
        alert('Time log added successfully!');
        if (onSuccess) onSuccess();
  
        setFormData({
          employee_id: '',
          project_id: '',
          date: '',
          hours_worked: '',
        });
      } catch (error) {
        console.error('Error adding time log:', error);
        alert('Failed to add time log. Check console for details.');
      }
    };
  
    return (
      <form style={styles.section} onSubmit={handleSubmit}>
        <h3>Add Time Log</h3>
        <input
          name="employee_id"
          value={formData.employee_id}
          onChange={handleChange}
          placeholder="Employee ID"
          style={styles.input}
          required
        />
        <input
          name="project_id"
          value={formData.project_id}
          onChange={handleChange}
          placeholder="Project ID"
          style={styles.input}
          required
        />
        <input
          name="date"
          value={formData.date}
          onChange={handleChange}
          type="date"
          style={styles.input}
          required
        />
        <input
          name="hours_worked"
          value={formData.hours_worked}
          onChange={handleChange}
          placeholder="Hours Worked"
          type="number"
          step="0.1"
          min="0"
          style={styles.input}
          required
        />
        <button type="submit" style={styles.submitBtn}>
          Submit
        </button>
      </form>
    );
  }
  
function AddVendorForm({ onSuccess }) {
    const [formData, setFormData] = useState({
      vendorId: '',
      name: '',
      serviceType: '',
      address: '',
      website: '',
      contact: '',
      email: '',
      pocName: '',
      pocEmail: '',
      pocPhone: '',
      gstNumber: '',
      panNumber: '',
      MonthlyCharges: '',
      isActive: true,
    });
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.post('http://localhost:5000/api/vendors', formData);
        alert('Vendor added successfully!');
        if (onSuccess) onSuccess();
        // Optionally reset the form
        setFormData({
          vendorId: '',
          name: '',
          serviceType: '',
          address: '',
          website: '',
          contact: '',
          email: '',
          pocName: '',
          pocEmail: '',
          pocPhone: '',
          gstNumber: '',
          panNumber: '',
          MonthlyCharges: '',
          isActive: true,
        });
      } catch (error) {
        console.error('Error adding vendor:', error);
        alert('Failed to add vendor. Check console for details.');
      }
    };
  
    return (
      <form style={styles.section} onSubmit={handleSubmit}>
        <h3>Add Vendor</h3>
        <input name="vendorId" value={formData.vendorId} onChange={handleChange} placeholder="Vendor ID" style={styles.input} required />
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" style={styles.input} required />
        <input name="serviceType" value={formData.serviceType} onChange={handleChange} placeholder="Service Type" style={styles.input} required />
        <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" style={styles.input} />
        <input name="website" value={formData.website} onChange={handleChange} placeholder="Website" style={styles.input} />
        <input name="contact" value={formData.contact} onChange={handleChange} placeholder="Contact" style={styles.input} />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" style={styles.input} type="email" />
        <input name="pocName" value={formData.pocName} onChange={handleChange} placeholder="POC Name" style={styles.input} />
        <input name="pocEmail" value={formData.pocEmail} onChange={handleChange} placeholder="POC Email" style={styles.input} type="email" />
        <input name="pocPhone" value={formData.pocPhone} onChange={handleChange} placeholder="POC Phone" style={styles.input} />
        <input name="gstNumber" value={formData.gstNumber} onChange={handleChange} placeholder="GST Number" style={styles.input} />
        <input name="panNumber" value={formData.panNumber} onChange={handleChange} placeholder="PAN Number" style={styles.input} />
        <input name="MonthlyCharges" value={formData.MonthlyCharges} onChange={handleChange} placeholder="Monthly Charges" type="number" style={styles.input} />
        <label style={{ marginBottom: '1rem', display: 'block' }}>
          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
          {' '}Active
        </label>
        <button type="submit" style={styles.submitBtn}>Submit</button>
      </form>
    );
  }
  
  

  function AddExpenseForm({ onSuccess }) {
    const [formData, setFormData] = useState({
      type: '',
      description: '',
      amount: '',
      date: '',
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const payload = {
          type: formData.type.trim(),
          description: formData.description.trim(),
          amount: Number(formData.amount) || 0,
          date: formData.date,
        };
  
        await axios.post('http://localhost:5000/api/expenses', payload);
        alert('Expense added successfully!');
        if (onSuccess) onSuccess();
  
        setFormData({
          type: '',
          description: '',
          amount: '',
          date: '',
        });
      } catch (error) {
        console.error('Error adding expense:', error);
        alert('Failed to add expense. Check console for details.');
      }
    };
  
    return (
      <form style={styles.section} onSubmit={handleSubmit}>
        <h3>Add Expense</h3>
        <input
          name="type"
          value={formData.type}
          onChange={handleChange}
          placeholder="Type"
          style={styles.input}
          required
        />
        <input
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          style={styles.input}
          required
        />
        <input
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Amount"
          type="number"
          step="0.01"
          min="0"
          style={styles.input}
          required
        />
        <input
          name="date"
          value={formData.date}
          onChange={handleChange}
          type="date"
          style={styles.input}
          required
        />
        <button type="submit" style={styles.submitBtn}>
          Submit
        </button>
      </form>
    );
  }

// function AddClientForm() {
//   return (
//     <div style={styles.section}>
//       <h2>Add Client</h2>
//       <form>
//         <input placeholder="Client Name" style={styles.input} />
//         <input placeholder="Email" style={styles.input} />
//         <input placeholder="Contact Number" style={styles.input} />
//         <button style={styles.submitBtn}>Submit</button>
//       </form>
//     </div>
//   );
// }

function AddProjectForm({ onSuccess }) {
    const [formData, setFormData] = useState({
      name: '',
      client_id: '',
      project_manager: '',
      start_date: '',
      end_date: '',
      billing_type: '',
      total_amount: '',
      assigned_employees: '',
      employee_count: '',
      status: '',
      monthlyRetainer: '',
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        // Convert assigned_employees string to array by comma separation and trim spaces
        const assignedEmployeesArr = formData.assigned_employees
          ? formData.assigned_employees.split(',').map((emp) => emp.trim())
          : [];
  
        const payload = {
          ...formData,
          total_amount: Number(formData.total_amount) || 0,
          employee_count: Number(formData.employee_count) || 0,
          monthlyRetainer: Number(formData.monthlyRetainer) || 0,
          assigned_employees: assignedEmployeesArr,
        };
  
        await axios.post('http://localhost:5000/api/projects', payload);
        alert('Project added successfully!');
        if (onSuccess) onSuccess();
  
        setFormData({
          name: '',
          client_id: '',
          project_manager: '',
          start_date: '',
          end_date: '',
          billing_type: '',
          total_amount: '',
          assigned_employees: '',
          employee_count: '',
          status: '',
          monthlyRetainer: '',
        });
      } catch (error) {
        console.error('Error adding project:', error);
        alert('Failed to add project. Check console for details.');
      }
    };
  
    return (
      <form style={styles.section} onSubmit={handleSubmit}>
        <h3>Add Project</h3>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Project Name"
          style={styles.input}
          required
        />
        <input
          name="client_id"
          value={formData.client_id}
          onChange={handleChange}
          placeholder="Client ID"
          style={styles.input}
          required
        />
        <input
          name="project_manager"
          value={formData.project_manager}
          onChange={handleChange}
          placeholder="Project Manager (Employee ID)"
          style={styles.input}
          required
        />
        <input
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          placeholder="Start Date"
          type="date"
          style={styles.input}
          required
        />
        <input
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          placeholder="End Date"
          type="date"
          style={styles.input}
          required
        />
        <input
          name="billing_type"
          value={formData.billing_type}
          onChange={handleChange}
          placeholder="Billing Type (fixed/hourly)"
          style={styles.input}
          required
        />
        <input
          name="total_amount"
          value={formData.total_amount}
          onChange={handleChange}
          placeholder="Total Amount"
          type="number"
          style={styles.input}
          required
        />
        <input
          name="assigned_employees"
          value={formData.assigned_employees}
          onChange={handleChange}
          placeholder="Assigned Employees (comma separated IDs)"
          style={styles.input}
        />
        <input
          name="employee_count"
          value={formData.employee_count}
          onChange={handleChange}
          placeholder="Employee Count"
          type="number"
          style={styles.input}
        />
        <input
          name="status"
          value={formData.status}
          onChange={handleChange}
          placeholder="Status (active/inactive)"
          style={styles.input}
        />
        <input
          name="monthlyRetainer"
          value={formData.monthlyRetainer}
          onChange={handleChange}
          placeholder="Monthly Retainer"
          type="number"
          style={styles.input}
        />
        <button type="submit" style={styles.submitBtn}>
          Submit
        </button>
      </form>
    );
  }
  function AddClientForm({ onSuccess }) {
    const [formData, setFormData] = useState({
      name: '',
      industry: '',
      address: '',
      poc_name: '',
      poc_email: '',
      poc_phone: '',
      status: '',
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.post('http://localhost:5000/api/clients', formData);
        alert('Client added successfully!');
        if (onSuccess) onSuccess();
  
        setFormData({
          name: '',
          industry: '',
          address: '',
          poc_name: '',
          poc_email: '',
          poc_phone: '',
          status: '',
        });
      } catch (error) {
        console.error('Error adding client:', error);
        alert('Failed to add client. Check console for details.');
      }
    };
  
    return (
      <form style={styles.section} onSubmit={handleSubmit}>
        <h3>Add Client</h3>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Client Name"
          style={styles.input}
          required
        />
        <input
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          placeholder="Industry"
          style={styles.input}
          required
        />
        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          style={styles.input}
          required
        />
        <input
          name="poc_name"
          value={formData.poc_name}
          onChange={handleChange}
          placeholder="POC Name"
          style={styles.input}
        />
        <input
          name="poc_email"
          value={formData.poc_email}
          onChange={handleChange}
          placeholder="POC Email"
          type="email"
          style={styles.input}
        />
        <input
          name="poc_phone"
          value={formData.poc_phone}
          onChange={handleChange}
          placeholder="POC Phone"
          style={styles.input}
        />
        <input
          name="status"
          value={formData.status}
          onChange={handleChange}
          placeholder="Status (active/inactive)"
          style={styles.input}
        />
        <button type="submit" style={styles.submitBtn}>
          Submit
        </button>
      </form>
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
