import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import AddEmployee from './pages/AddEmployee';
import EditEmployee from './pages/EditEmployee';
import ViewEmployee from './Components/EmployeeDetails';
import EmployeeList from './Components/EmployeeList';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/edit-employee/:id" element={<EditEmployee />} />
        <Route path="/employee/:id" element={<ViewEmployee />} />
        <Route path="/employees" element={<EmployeeList />} /> {/* optional route for list */}
      </Routes>
    </Router>
  );
}

export default App;
