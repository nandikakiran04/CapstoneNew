import React, { useState } from 'react';
import ClientForm from '../component/ClientForm';
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

function AddClient() {
  const [client, setClient] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(client); // Replace with POST logic if needed
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
            Add Client
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>HOME</Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ mt: 5 }}>
        <ClientForm client={client} onChange={handleChange} onSubmit={handleSubmit} />
      </Container>
    </Box>
  );
}

export default AddClient;
