const Employee = require('../models/Employee');

// CRUD operations
exports.getAllEmployees = () => Employee.find();
exports.getEmployeeById = id => Employee.findById(id);
exports.createEmployee = data => Employee.create(data);
exports.updateEmployee = (id, data) => Employee.findByIdAndUpdate(id, data, { new: true });
exports.deleteEmployee = id => Employee.findByIdAndDelete(id);
exports.getEmployeeByEmail = email => Employee.findOne({ email: email });

// After creation, publish event
exports.publishEmployeeCreated = async (pubClient, emp) => {
  const payload = JSON.stringify({
    id: emp._id,
    name: emp.name,
    base_salary: emp.base_salary,
    salary_type: emp.salary_type
  });
  await pubClient.publish('employee.created', payload);
};
