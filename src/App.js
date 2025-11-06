import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import CustomerList from "./components/CustomerList";
import ProductList from "./components/ProductList";
import InvoiceList from "./components/InvoiceList";
import AddCustomer from "./components/AddCustomer";
import AddProduct from "./components/AddProduct";
import AddInvoice from "./components/AddInvoice";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/invoices" element={<InvoiceList />} />
        <Route path="/add-customer" element={<AddCustomer />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/add-invoice" element={<AddInvoice />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
