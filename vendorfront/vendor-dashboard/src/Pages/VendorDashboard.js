import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Paper, Container, Typography, Button,
  AppBar, Toolbar, Box
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const VendorDashboard = () => {
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await api.get('/vendors');
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const deleteVendor = async (id) => {
    try {
      await api.delete(`/vendors/${id}`);
      fetchVendors();
    } catch (error) {
      console.error('Error deleting vendor:', error);
    }
  };

  const goToAddVendor = () => {
    navigate('/add-vendor');
  };

  const handleEdit = (id) => {
    navigate(`/edit-vendor/${id}`);
  };

  const handleView = (id) => {
    navigate(`/vendor/${id}`);
  };

  return (
    <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Vendor Dashboard</Typography>
          <Button color="inherit" onClick={goToAddVendor}>+ Add Vendor</Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ mt: 5 }}>
        <Paper elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vendor Name</TableCell>
                <TableCell>Service Type</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>No vendors found.</TableCell>
                </TableRow>
              ) : (
                vendors.map((vendor) => (
                  <TableRow key={vendor._id}>
                    <TableCell
                      onClick={() => handleView(vendor._id)}
                      style={styles.clickable}
                    >
                      {vendor.name}
                    </TableCell>
                    <TableCell>{vendor.serviceType || 'N/A'}</TableCell>
                    <TableCell>{vendor.isActive ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(vendor._id)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => deleteVendor(vendor._id)}>
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

export default VendorDashboard;
