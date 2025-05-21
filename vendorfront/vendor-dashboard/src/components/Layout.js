// components/Layout.js
import React from 'react';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => (
  <>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Vendor Dashboard
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/add-vendor">Add Vendor</Button>
      </Toolbar>
    </AppBar>
    <Container sx={{ mt: 4 }}>
      {children}
    </Container>
  </>
);

export default Layout;
