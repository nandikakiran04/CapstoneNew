import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  TextField, Button, Stack, Typography, AppBar, Toolbar,
  IconButton, Box
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function EditVendor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState({
    vendorId: '', name: '', serviceType: '', address: '', website: '',
    contact: '', email: '', MonthlyCharges: '', pocName: '',
    pocEmail: '', pocPhone: '', gstNumber: '', panNumber: '', isActive: ''
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/vendors/${id}`)
      .then(res => setVendor(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/vendors/${id}`, vendor)
      .then(() => navigate('/'))
      .catch(err => console.error(err));
  };

  return (
    <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Edit Vendor</Typography>
          <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
        </Toolbar>
      </AppBar>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ maxWidth: 700, margin: '2rem auto', background: '#fff', padding: '2rem', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>Edit Vendor</Typography>
        <Stack spacing={2}>
          <TextField name="vendorId" label="Vendor ID" value={vendor.vendorId} onChange={handleChange} fullWidth />
          <TextField name="name" label="Name" value={vendor.name} onChange={handleChange} fullWidth />
          <TextField name="serviceType" label="Service Type" value={vendor.serviceType} onChange={handleChange} fullWidth />
          <TextField name="address" label="Address" value={vendor.address} onChange={handleChange} fullWidth />
          <TextField name="website" label="Website" value={vendor.website} onChange={handleChange} fullWidth />
          <TextField name="contact" label="Contact" value={vendor.contact} onChange={handleChange} fullWidth />
          <TextField name="email" label="Email" value={vendor.email} onChange={handleChange} fullWidth />
          <TextField name="MonthlyCharges" label="Monthly Charges" value={vendor.MonthlyCharges} onChange={handleChange} fullWidth />
          <TextField name="pocName" label="POC Name" value={vendor.pocName} onChange={handleChange} fullWidth />
          <TextField name="pocEmail" label="POC Email" value={vendor.pocEmail} onChange={handleChange} fullWidth />
          <TextField name="pocPhone" label="POC Contact" value={vendor.pocPhone} onChange={handleChange} fullWidth />
          <TextField name="gstNumber" label="GST Number" value={vendor.gstNumber} onChange={handleChange} fullWidth />
          <TextField name="panNumber" label="PAN Number" value={vendor.panNumber} onChange={handleChange} fullWidth />
          <TextField name="isActive" label="Active (Yes/No)" value={vendor.isActive} onChange={handleChange} fullWidth />
          <Button type="submit" variant="contained" color="primary">Update Vendor</Button>
        </Stack>
      </form>
    </Box>
  );
}

export default EditVendor;
