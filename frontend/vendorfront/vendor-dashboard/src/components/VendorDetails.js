import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Typography, Paper, CircularProgress, AppBar, Toolbar, IconButton, Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ViewVendor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/vendors/${id}`);
        setVendor(response.data);
      } catch (err) {
        setError('Failed to fetch vendor details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
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

  if (!vendor) {
    return <Typography align="center" mt={5}>Vendor not found.</Typography>;
  }

  return (
    <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Vendor Details
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
        </Toolbar>
      </AppBar>

      {/* Vendor Details Card */}
      <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
            {vendor.name}
          </Typography>

          {[
            { label: 'Vendor ID', value: vendor.vendorId },
            { label: 'Service Type', value: vendor.serviceType },
            { label: 'Address', value: vendor.address },
            { label: 'Website', value: vendor.website },
            { label: 'Contact', value: vendor.contact },
            { label: 'Email', value: vendor.email },
            { label: 'Monthly Charges', value: vendor.MonthlyCharges },
            { label: 'POC Name', value: vendor.pocName },
            { label: 'POC Email', value: vendor.pocEmail },
            { label: 'POC Contact', value: vendor.pocPhone },
            { label: 'GST Number', value: vendor.gstNumber },
            { label: 'PAN Number', value: vendor.panNumber },
            { label: 'Active', value: vendor.isActive ? 'Yes' : 'No' },
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

export default ViewVendor;
