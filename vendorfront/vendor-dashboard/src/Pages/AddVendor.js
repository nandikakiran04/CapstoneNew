import React, { useState } from 'react';
import VendorForm from '../components/VendorForm';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Container,
  Box
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

function AddVendor() {
  const [vendor, setVendor] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(vendor); // Replace with POST logic
  };

  return (
    <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* App Bar with Back Arrow and Title */}
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Add Vendor
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>HOME</Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ mt: 5 }}>
        {/* <Typography variant="h5" gutterBottom>Add Vendor</Typography> */}
        <VendorForm vendor={vendor} onChange={handleChange} onSubmit={handleSubmit} />
      </Container>
    </Box>
  );
}

export default AddVendor;
