const payrollService = require('../services/payrollServices');

exports.getAll = async (req, res) => {
  try {
    const data = await payrollService.getAllPayrolls();
    res.json(data);
  } catch (err) {
    console.error('[getAll]', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await payrollService.getPayrollById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Payroll not found' });
    res.json(data);
  } catch (err) {
    console.error('[getById]', err);
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const record = await payrollService.generateAndRecordExpense(req.body);
    res.status(201).json(record);
  } catch (err) {
    console.error('[create]', err);
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await payrollService.updatePayroll(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Payroll not found' });
    res.json(updated);
  } catch (err) {
    console.error('[update]', err);
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await payrollService.deletePayroll(req.params.id);
    if (!result) return res.status(404).json({ message: 'Payroll not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('[remove]', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getByEmployee = async (req, res) => {
  try {
    const data = await payrollService.getByEmployee(req.params.employeeId);
    res.json(data);
  } catch (err) {
    console.error('[getByEmployee]', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getByMonthYear = async (req, res) => {
  console.log('[getByMonthYear] params=', req.params);
  try {
    const month = parseInt(req.params.month, 10);
    const year  = parseInt(req.params.year, 10);

    if (isNaN(month) || isNaN(year)) {
      return res.status(400).json({ message: 'Month and year must be numbers' });
    }

    const data = await payrollService.getByMonthYear(month, year);
    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'No payrolls found for that month/year' });
    }
    res.json(data);
  } catch (err) {
    console.error('[getByMonthYear]', err);
    res.status(500).json({ message: err.message });
  }
};

exports.calculatePayroll = async (req, res) => {
  try {
    const { month, year } = req.body;
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }
    const result = await payrollService.calculateMonthlyPayroll(
      parseInt(month, 10),
      parseInt(year, 10)
    );
    res.json(result);
  } catch (err) {
    console.error('[calculatePayroll]', err);
    res.status(500).json({ message: err.message });
  }
};
