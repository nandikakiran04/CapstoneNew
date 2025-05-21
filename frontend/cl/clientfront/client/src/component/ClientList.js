import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Paper, Container, Typography
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  const fetchClients = async () => {
    try {
      const res = await api.get('/clients');
      setClients(res.data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    }
  };

  const deleteClient = async (id) => {
    try {
      await api.delete(`/clients/${id}`);
      fetchClients(); // refresh list
    } catch (error) {
      console.error('Failed to delete client:', error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom>Clients</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>POC</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>No clients found.</TableCell>
              </TableRow>
            ) : (
              clients.map(client => (
                <TableRow key={client._id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.poc_name}</TableCell>
                  <TableCell>{client.poc_email}</TableCell>
                  <TableCell>{client.poc_phone || 'N/A'}</TableCell>
                  <TableCell>{client.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => navigate(`/edit-client/${client._id}`)}>
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
  );
};

export default ClientList;
