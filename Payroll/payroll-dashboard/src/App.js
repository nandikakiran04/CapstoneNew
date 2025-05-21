import { useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer
} from 'recharts';

const COLORS = ['#4CAF50', '#2196F3', '#FF9800'];

export default function PayrollDashboard() {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [payrollData, setPayrollData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch payroll data from API
  const fetchPayroll = async () => {
    setError(null); // Clear any previous errors
    console.log("Fetching payroll data..."); // Debugging log

    try {
      const res = await fetch('http://localhost:5000/api/payrolls/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, month }),
      });
      console.log(res); // Debugging log for response

      if (!res.ok) throw new Error('Failed to fetch payroll');
      const data = await res.json();
      console.log('Payroll Data:', data); // Debugging log for data
      setPayrollData(data); // Set state with the fetched data
    } catch (err) {
      setPayrollData(null);
      setError('Error fetching payroll data.');
      console.error(err); // Log the error for debugging
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (year && month) {
      fetchPayroll(); // Call API
    } else {
      setError('Please enter both year and month.');
    }
  };

  // Pie and Bar data
  const pieData = payrollData
    ? [
        { name: 'Total Salary', value: payrollData.totalSalary || 0 },
        { name: 'Deductions', value: payrollData.totalDeductions || 0 },
        {
          name: 'Net Pay',
          value: (payrollData.totalSalary || 0) - (payrollData.totalDeductions || 0),
        },
      ]
    : [];

  const barData = payrollData?.employees?.map((emp) => ({
    name: emp.name,
    netPay: emp.netPay || 0,
  })) || [];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-3xl font-bold text-center py-6">Payroll Dashboard</h1>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex justify-center gap-4 p-4">
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Month (1-12)"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Fetch
        </button>
      </form>

      {/* Error Display */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Display charts */}
      {payrollData && barData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 pb-10">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="netPay" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">No payroll data loaded.</p>
      )}
    </div>
  );
}
