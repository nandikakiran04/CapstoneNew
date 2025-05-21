import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Typography, Paper, CircularProgress, AppBar, Toolbar,
  IconButton, Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ViewEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/employees/${id}`);
        setEmployee(response.data);
      } catch (err) {
        setError('Failed to fetch employee details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error" align="center" mt={5}>{error}</Typography>;
  }

  if (!employee) {
    return <Typography align="center" mt={5}>Employee not found.</Typography>;
  }

  return (
    <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Employee Details</Typography>
          <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
        </Toolbar>
      </AppBar>

      {/* Employee Details Card */}
      <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
            {employee.name}
          </Typography>

          {[
            { label: 'Email', value: employee.email },
            { label: 'Role', value: employee.role },
            { label: 'Base Salary', value: employee.base_salary },
            { label: 'Salary Type', value: employee.salary_type },
            { label: 'Active', value: employee.active ? 'Yes' : 'No' },
          ].map((item, index) => (
            <Typography key={index} sx={{ mb: 1 }}>
              <strong>{item.label}:</strong> {item.value || 'N/A'}
            </Typography>
          ))}
        </Paper>
      </Box>
    </Box>
  );
};

export default ViewEmployee;
