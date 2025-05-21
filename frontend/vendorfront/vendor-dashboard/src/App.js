import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Dashboard from './Pages/VendorDashboard';
import AddVendor from './Pages/AddVendor';
import EditVendor from './Pages/EditVendor';
import ViewVendor from './components/VendorDetails'
// import VendorList from './components/VendorList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-vendor" element={<AddVendor />} />
        <Route path="/edit-vendor/:id" element={<EditVendor />} />
        <Route path="/vendor/:id" element={<ViewVendor />} />
      </Routes>
    </Router>
  );
}

export default App;
