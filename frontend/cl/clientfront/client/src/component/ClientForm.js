import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Box, Typography, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const defaultClient = {
  name: '',
  industry: '',
  address: '',
  poc_name: '',
  poc_email: '',
  poc_phone: '',
  status: 'active',
};

const ClientForm = ({ clientId }) => {
  const [client, setClient] = useState(defaultClient);
  const navigate = useNavigate();

  const fetchClient = async () => {
    if (clientId) {
      try {
        const res = await api.get(`/clients/${clientId}`);
        setClient(res.data);
      } catch (error) {
        console.error('Error fetching client:', error);
      }
    }
  };

  useEffect(() => {
    fetchClient();
  }, [clientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (clientId) {
        await api.put(`/clients/${clientId}`, client);
      } else {
        await api.post('/clients', client);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {clientId ? 'Update Client' : 'Add Client'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={client.name}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Industry"
          name="industry"
          value={client.industry}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Address"
          name="address"
          value={client.address}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="POC Name"
          name="poc_name"
          value={client.poc_name}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="POC Email"
          name="poc_email"
          type="email"
          value={client.poc_email}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="POC Phone"
          name="poc_phone"
          value={client.poc_phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label="Status"
          name="status"
          value={client.status}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </TextField>

        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          {clientId ? 'Update' : 'Add'}
        </Button>
      </Box>
    </Container>
  );
};

export default ClientForm;
