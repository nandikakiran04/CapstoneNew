import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ClientDashboard from './pages/Dashboard'; // Assuming you have a ClientDashboard component
import AddClient from './pages/AddClient'; // AddClient component
import EditClient from './pages/EditClient'; // EditClient component
import ViewClient from './component/ClientDetails'; // ViewClient component
import ClientList from './component/ClientList'; // ClientList component

function App() {
  return (
    <Router>
      <Routes>
        {/* Dashboard page */}
        <Route path="/" element={<ClientDashboard />} />

        {/* Add Client page */}
        <Route path="/add-client" element={<AddClient />} />

        {/* Edit Client page */}
        <Route path="/edit-client/:id" element={<EditClient />} />

        {/* View Client page */}
        <Route path="/client/:id" element={<ViewClient />} />

        {/* List of Clients */}
        <Route path="/clients" element={<ClientList />} />
      </Routes>
    </Router>
  );
}

export default App;
