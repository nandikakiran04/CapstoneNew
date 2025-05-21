import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Box, Typography, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const defaultEmployee = {
  name: '',
  email: '',
  role: '',
  base_salary: '',
  salary_type: '',
  active: true
};

const EmployeeForm = ({ employeeId }) => {
  const [employee, setEmployee] = useState(defaultEmployee);
  const navigate = useNavigate();

  const fetchEmployee = async () => {
    if (employeeId) {
      const res = await api.get(`/employees/${employeeId}`);
      setEmployee(res.data);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee(prev => ({
      ...prev,
      [name]: name === 'active' ? value === 'true' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (employeeId) {
      await api.put(`/employees/${employeeId}`, employee);
    } else {
      await api.post('/employees', employee);
    }
    navigate('/');
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {employeeId ? 'Update Employee' : 'Add Employee'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          name="name"
          label="Name"
          value={employee.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="email"
          label="Email"
          value={employee.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="role"
          label="Role"
          value={employee.role}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="base_salary"
          label="Base Salary"
          type="number"
          value={employee.base_salary}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="salary_type"
          label="Salary Type"
          select
          value={employee.salary_type}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="hourly">Hourly</MenuItem>
        </TextField>
        <TextField
          name="active"
          label="Active"
          select
          value={employee.active.toString()}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="true">Yes</MenuItem>
          <MenuItem value="false">No</MenuItem>
        </TextField>
        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          {employeeId ? 'Update' : 'Add'}
        </Button>
      </Box>
    </Container>
  );
};

export default EmployeeForm;
