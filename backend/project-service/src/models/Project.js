const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  client_id: { type: String, required: true }, // External MS
  project_manager: { type: String, required: true }, // Employee ID of the project manager
  start_date: { type: Date, required: true },
  end_date: { type: Date },
  billing_type: { type: String, enum: ['fixed', 'hourly'], required: true },
  total_amount: { type: Number },
  assigned_employees: [{ type: String }], // Employee IDs
  employee_count: { type: Number, min: 0 }, // Optional field to track number of employees
  status: { type: String, enum: ['active', 'completed', 'on-hold'], default: 'active' },
  monthlyRetainer: {
      type: Number,
      default: 0
  },
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
