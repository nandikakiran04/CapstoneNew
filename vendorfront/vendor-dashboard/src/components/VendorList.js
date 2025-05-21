import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Paper, Container, Typography
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();

  const fetchVendors = async () => {
    const res = await api.get('/vendors');
    setVendors(res.data);
  };

  const deleteVendor = async (id) => {
    await api.delete(`/vendors/${id}`);
    fetchVendors();
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom>Vendors</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>POC</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendors.length === 0 ? (
              <TableRow><TableCell colSpan={5}>No vendors found.</TableCell></TableRow>
            ) : (
              vendors.map(v => (
                <TableRow key={v._id}>
                  <TableCell>{v.name}</TableCell>
                  <TableCell>{v.pocName}</TableCell>
                  <TableCell>{v.pocEmail}</TableCell>
                  <TableCell>{v.pocPhone}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => navigate(`/edit-vendor/${v._id}`)}><Edit /></IconButton>
                    <IconButton onClick={() => deleteVendor(v._id)}><Delete /></IconButton>
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

export default VendorList;
