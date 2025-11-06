// src/components/AddCustomer.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddCustomer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, phone }),
      });
      if (res.ok) {
        navigate("/customers");
      } else {
        setError("Could not add customer");
      }
    } catch {
      setError("Network error");
    }
  }

  return (
    <div className="container">
      <h3>Add Customer</h3>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div className="mb-2">
          <label>Name</label>
          <input className="form-control" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="mb-2">
          <label>Email</label>
          <input className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-2">
          <label>Phone</label>
          <input className="form-control" value={phone} onChange={e => setPhone(e.target.value)} required />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary">Add Customer</button>
      </form>
    </div>
  );
}
