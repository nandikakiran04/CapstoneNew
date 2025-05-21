const TimeLog = require('../models/TimeLog');

// Get all timelogs with optional filtering
exports.getFiltered = async (filter) => {
  return TimeLog.find(filter).sort({ date: -1 });
};

// Create multiple timelog entries at once
exports.createBulk = async (entries) => {
  return TimeLog.insertMany(entries);
};

// Get all employees who logged time in a specific month/year with their total hours
exports.getLoggedEmployeesWithHours = async (month, year) => {
  const dateFrom = new Date(`${year}-${month}-01`);
  const lastDay = new Date(year, month, 0).getDate(); // Get last day of month
  const dateTo = new Date(`${year}-${month}-${lastDay}`);

  return TimeLog.aggregate([
    {
      $match: {
        date: { $gte: dateFrom, $lte: dateTo }
      }
    },
    {
      $group: {
        _id: '$employee_id',
        hours_worked: { $sum: '$hours_worked' }
      }
    },
    {
      $match: {
        hours_worked: { $gte: 1 }
      }
    },
    {
      $project: {
        employee_id: '$_id',
        hours_worked: 1,
        _id: 0
      }
    }
  ]);
};

// Basic CRUD operations
exports.getAllTimeLogs = () => TimeLog.find().sort({ date: -1 });
exports.getTimeLogById = id => TimeLog.findById(id);
exports.createTimeLog = data => TimeLog.create(data);
exports.updateTimeLog = (id, data) => TimeLog.findByIdAndUpdate(id, data, { new: true });
exports.deleteTimeLog = id => TimeLog.findByIdAndDelete(id);









// const TimeLog = require('../models/TimeLog');


// const getFiltered = async (filter) => {
//   return TimeLog.find(filter).sort({ date: -1 });
// };

// module.exports = {
//   getFiltered
// };

// const createBulk = async (entries) => {
//     return TimeLog.insertMany(entries);
//   };
  
//   module.exports = {
//     getFiltered,
//     createBulk
//   };
