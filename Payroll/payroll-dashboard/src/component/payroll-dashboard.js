import React from 'react';
import { Box, Typography, AppBar, Toolbar, Container } from '@mui/material';

const Dashboard = () => {
  return (
    <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Client Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to the Client Dashboard
        </Typography>
        <Typography variant="body1">
          This is the main landing page for managing your clients.
        </Typography>
      </Container>
    </Box>
  );
};

export default Dashboard;
