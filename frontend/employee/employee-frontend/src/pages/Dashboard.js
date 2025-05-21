import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Paper, Container, Typography, Button,
  AppBar, Toolbar, Box
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const goToAddEmployee = () => {
    navigate('/add-employee');
  };

  const handleEdit = (id) => {
    navigate(`/edit-employee/${id}`);
  };

  const handleView = (id) => {
    navigate(`/employee/${id}`);
  };

  return (
    <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Employee Dashboard</Typography>
          <Button color="inherit" onClick={goToAddEmployee}>+ Add Employee</Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ mt: 5 }}>
        <Paper elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Base Salary</TableCell>
                <TableCell>Salary Type</TableCell>
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
                employees.map((employee) => (
                  <TableRow key={employee._id}>
                    <TableCell
                      onClick={() => handleView(employee._id)}
                      style={styles.clickable}
                    >
                      {employee.name}
                    </TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>{employee.base_salary}</TableCell>
                    <TableCell>{employee.salary_type}</TableCell>
                    <TableCell>{employee.active ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(employee._id)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => deleteEmployee(employee._id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </Box>
  );
};

const styles = {
  clickable: {
    cursor: 'pointer',
    color: '#007bff',
    textDecoration: 'underline'
  }
};

export default Dashboard;
