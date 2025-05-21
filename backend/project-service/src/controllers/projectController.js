const projectService = require('../services/projectService');

exports.getAll = async (req, res) => {
  try {
    // Optional filter: ?employeeId=123
    const { employeeId } = req.query;

    // If no employeeId is provided, service will return all projects
    const projects = await projectService.getAllProjects(employeeId);
    res.status(200).json(projects);
  } catch (err) {
    console.error('Project/getAll error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const proj = await projectService.getProjectById(req.params.id);
    if (!proj) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json(proj);
  } catch (err) {
    console.error('Project/getById error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, client_id, project_manager, start_date, billing_type } = req.body;

    // Validate required fields
    if (!name || !client_id || !project_manager || !start_date || !billing_type) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, client_id, project_manager, start_date, and billing_type are required' 
      });
    }

    const newProj = await projectService.createProject(req.body);
    res.status(201).json(newProj);
  } catch (err) {
    console.error('Project/create error:', err);
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, client_id, project_manager, start_date, billing_type } = req.body;

    // Validate required fields
    if (!name || !client_id || !project_manager || !start_date || !billing_type) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, client_id, project_manager, start_date, and billing_type are required' 
      });
    }

    const updated = await projectService.updateProject(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error('Project/update error:', err);
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await projectService.deleteProject(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Project/remove error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.calculateMonthlyIncome = async (req, res) => {
    try {
        const { month, year } = req.body;
        if (!month || !year) {
            return res.status(400).json({ message: 'Month and year are required' });
        }
        const incomeData = await projectService.calculateMonthlyRetainerIncome(month, year);
        res.status(200).json(incomeData);
    } catch (err) {
        console.error('Error calculating monthly income:', err);
        res.status(500).json({ message: err.message });
    }
};
