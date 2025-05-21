import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import PayrollDetails from './payrolldetails';
import VendorDetails from './vendordetails';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
    <PayrollDetails />
    <VendorDetails />
  </BrowserRouter>
);
