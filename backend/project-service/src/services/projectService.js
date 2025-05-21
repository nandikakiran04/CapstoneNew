const Project = require("../models/Project");

exports.getAllProjects = () => Project.find();
exports.getProjectById = (id) => Project.findById(id);
exports.createProject = (data) => Project.create(data);
exports.updateProject = (id, data) => Project.findByIdAndUpdate(id, data, { new: true });
exports.deleteProject = (id) => Project.findByIdAndDelete(id);
exports.getAllProjects = (employeeId) => {
    if (employeeId) {
      // Find projects where assigned_employees.id matches
      return Project.find({ 'assigned_employees.id': employeeId }).sort({ start_date: -1 });
    } else {
      return Project.find().sort({ start_date: -1 });
    }
  };
exports.calculateMonthlyRetainerIncome = async (month, year) => {
    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const activeProjects = await Project.find({
            status: 'active',
            $or: [
                {
                    start_date: { $lte: endDate },
                    $or: [
                        { end_date: { $gte: startDate } },
                        { end_date: null }
                    ]
                }
            ]
        });

        let retainerIncome = 0;
        let fixedIncome = 0;

        activeProjects.forEach(project => {
            // Always include monthly retainer if project is active during month
            retainerIncome += project.monthlyRetainer || 0;
            
            // Include fixed billing if project is active during month
            if (project.billing_type === 'fixed') {
                fixedIncome += project.total_amount || 0;
            }
        });

        return {
            month,
            year,
            retainerIncome,
            fixedIncome,
            totalIncome: retainerIncome + fixedIncome
        };
    } catch (error) {
        console.error('Error calculating monthly income:', error);
        throw error;
    }
};
exports.calculateMonthlyRetainerIncome = async (month, year) => {
    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const activeProjects = await Project.find({
            status: 'active',
            $or: [
                {
                    start_date: { $lte: endDate },
                    $or: [
                        { end_date: { $gte: startDate } },
                        { end_date: null }
                    ]
                }
            ]
        });

        let retainerIncome = 0;
        let fixedIncome = 0;

        activeProjects.forEach(project => {
            // Always include monthly retainer if project is active during month
            retainerIncome += project.monthlyRetainer || 0;
            
            // Include fixed billing if project is active during month
            if (project.billing_type === 'fixed') {
                fixedIncome += project.total_amount || 0;
            }
        });

        return {
            month,
            year,
            retainerIncome,
            fixedIncome,
            totalIncome: retainerIncome + fixedIncome
        };
    } catch (error) {
        console.error('Error calculating monthly income:', error);
        throw error;
    }
};