const TimeLog = require('../models/TimeLog');
const timelogServices = require('../services/timelogServices');

exports.getAll = async (req, res) => {
  try {
    const { employeeId, dateFrom, dateTo } = req.query;

    const query = {};

    if (employeeId) {
      query.employee_id = employeeId;
    }

    if (dateFrom && dateTo) {
      query.date = {
        $gte: new Date(dateFrom),
        $lte: new Date(dateTo)
      };
    }

    const logs = await TimeLog.find(query).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const log = await TimeLog.findById(req.params.id);
    if (!log) return res.status(404).json({ message: 'TimeLog not found' });
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { employee_id, project_id, date, hours_worked } = req.body;
    const log = await TimeLog.create({ employee_id, project_id, date, hours_worked });
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.createBulk = async (req, res) => {
  try {
    const entries = req.body;
    if (!Array.isArray(entries)) {
      return res.status(400).json({ error: 'Payload must be an array' });
    }
    const docs = await timelogServices.createBulk(entries);
    res.status(201).json(docs);
  } catch (err) {
    console.error('Bulk create error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updates = req.body;
    const log = await TimeLog.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!log) return res.status(404).json({ message: 'TimeLog not found' });
    res.json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const log = await TimeLog.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ message: 'TimeLog not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get employees who have logged hours in a specific month with their total hours
exports.getLoggedEmployees = async (req, res) => {
  try {
    const { month, year } = req.body;
    
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }

    const logs = await timelogServices.getLoggedEmployeesWithHours(month, year);
    res.json(logs);
  } catch (err) {
    console.error('Error in getLoggedEmployees:', err);
    res.status(500).json({ message: err.message });
  }
};

