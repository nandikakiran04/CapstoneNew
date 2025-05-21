import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Paper, Container, Typography
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    const res = await api.get('/employees');
    setEmployees(res.data);
  };

  const deleteEmployee = async (id) => {
    await api.delete(`/employees/${id}`);
    fetchEmployees();
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom>Employees</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Salary Type</TableCell>
              <TableCell>Base Salary</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>No employees found.</TableCell>
              </TableRow>
            ) : (
              employees.map(emp => (
                <TableRow key={emp._id}>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.role}</TableCell>
                  <TableCell>{emp.salary_type}</TableCell>
                  <TableCell>{emp.base_salary}</TableCell>
                  <TableCell>{emp.active ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => navigate(`/edit-employee/${emp._id}`)}><Edit /></IconButton>
                    <IconButton onClick={() => deleteEmployee(emp._id)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default EmployeeList;
