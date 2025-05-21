import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Paper, Container, Typography, Button,
  AppBar, Toolbar, Box
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const deleteClient = async (id) => {
    try {
      await api.delete(`/clients/${id}`);
      fetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const goToAddClient = () => {
    navigate('/add-client');
  };

  const handleEdit = (id) => {
    navigate(`/edit-client/${id}`);
  };

  const handleView = (id) => {
    navigate(`/client/${id}`);
  };

  return (
    <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Client Dashboard</Typography>
          <Button color="inherit" onClick={goToAddClient}>+ Add Client</Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ mt: 5 }}>
        <Paper elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client Name</TableCell>
                <TableCell>Industry</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>No clients found.</TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client._id}>
                    <TableCell
                      onClick={() => handleView(client._id)}
                      style={styles.clickable}
                    >
                      {client.name}
                    </TableCell>
                    <TableCell>{client.industry || 'N/A'}</TableCell>
                    <TableCell>{client.status === 'active' ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(client._id)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => deleteClient(client._id)}>
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

export default ClientDashboard;
