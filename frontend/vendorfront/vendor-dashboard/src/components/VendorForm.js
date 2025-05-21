import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const defaultVendor = {
  vendorId: '',
  name: '',
  serviceType: '',
  address: '',
  website: '',
  contact: '',
  email: '',
  MonthlyCharges:'',
  pocName: '',
  pocEmail: '',
  pocPhone: '',
  gstNumber: '',
  panNumber: ''
};

const VendorForm = ({ vendorId }) => {
  const [vendor, setVendor] = useState(defaultVendor);
  const navigate = useNavigate();

  const fetchVendor = async () => {
    if (vendorId) {
      const res = await api.get(`/vendors/${vendorId}`);
      setVendor(res.data);
    }
  };

  useEffect(() => {
    fetchVendor();
  }, [vendorId]);

  const handleChange = (e) => {
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (vendorId) {
      await api.put(`/vendors/${vendorId}`, vendor);
    } else {
      await api.post('/vendors', vendor);
    }
    navigate('/');
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {vendorId ? 'Update Vendor' : 'Add Vendor'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        {Object.keys(defaultVendor).map((key) => (
          <TextField
            key={key}
            label={key}
            name={key}
            value={vendor[key]}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        ))}
        <Button variant="contained" type="submit">
          {vendorId ? 'Update' : 'Add'}
        </Button>
      </Box>
    </Container>
  );
};

export default VendorForm;
