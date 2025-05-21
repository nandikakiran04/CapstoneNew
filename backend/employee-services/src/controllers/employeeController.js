const employeeServices = require('../services/employeeServices');

exports.getAll = async (req, res) => {
  const data = await employeeServices.getAllEmployees();
  res.json(data);
};

exports.getById = async (req, res) => {
  const data = await employeeServices.getEmployeeById(req.params.id);
  if (!data) return res.status(404).json({ message: 'Not found' });
  res.json(data);
};

exports.getByEmail = async (req, res) => {
  const data = await employeeServices.getEmployeeByEmail(req.params.email);
  if (!data) return res.status(404).json({ message: 'Employee not found' });
  res.json(data);
};

exports.create = async (req, res) => {
  // 1) Create in DB
  const emp = await employeeServices.createEmployee(req.body);
  // 2) Publish event via Redis client stored in app.locals
  await employeeServices.publishEmployeeCreated(req.app.locals.pub, emp);
  res.status(201).json(emp);
};

exports.update = async (req, res) => {
  const updated = await employeeServices.updateEmployee(req.params.id, req.body);
  res.json(updated);
};

exports.remove = async (req, res) => {
  await employeeServices.deleteEmployee(req.params.id);
  res.json({ message: 'Deleted' });
};
