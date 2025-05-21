import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  TextField, Button, Stack, Typography, AppBar, Toolbar,
  IconButton, Box
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState({
    name: '', industry: '', address: '', poc_name: '', poc_email: '', poc_phone: '', status: ''
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/clients/${id}`)
      .then(res => setClient(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/clients/${id}`, client)
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
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Edit Client</Typography>
          <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
        </Toolbar>
      </AppBar>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ maxWidth: 700, margin: '2rem auto', background: '#fff', padding: '2rem', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>Edit Client</Typography>
        <Stack spacing={2}>
          <TextField name="name" label="Client Name" value={client.name} onChange={handleChange} fullWidth />
          <TextField name="industry" label="Industry" value={client.industry} onChange={handleChange} fullWidth />
          <TextField name="address" label="Address" value={client.address} onChange={handleChange} fullWidth />
          <TextField name="poc_name" label="POC Name" value={client.poc_name} onChange={handleChange} fullWidth />
          <TextField name="poc_email" label="POC Email" value={client.poc_email} onChange={handleChange} fullWidth />
          <TextField name="poc_phone" label="POC Phone" value={client.poc_phone} onChange={handleChange} fullWidth />
          <TextField name="status" label="Status (active/inactive)" value={client.status} onChange={handleChange} fullWidth />
          <Button type="submit" variant="contained" color="primary">Update Client</Button>
        </Stack>
      </form>
    </Box>
  );
}

export default EditClient;
