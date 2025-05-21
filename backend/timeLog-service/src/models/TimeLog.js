const mongoose = require('mongoose');

const timeLogSchema = new mongoose.Schema({
  employee_id: {
    type: String,
    required: true
  },
  project_id: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  hours_worked: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TimeLog', timeLogSchema);
