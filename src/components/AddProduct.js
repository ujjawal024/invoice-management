// src/components/AddProduct.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, price }),
      });
      if (res.ok) {
        navigate("/products");
      } else {
        setError("Could not add product");
      }
    } catch {
      setError("Network error");
    }
  }

  return (
    <div className="container">
      <h3>Add Product</h3>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div className="mb-2">
          <label>Product Name</label>
          <input className="form-control" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="mb-2">
          <label>Price</label>
          <input type="number" className="form-control" value={price} onChange={e => setPrice(e.target.value)} required />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary">Add Product</button>
      </form>
    </div>
  );
}
