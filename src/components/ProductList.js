import React, { useEffect, useState } from "react";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/products", { credentials: "include" })
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => setError("Could not load products!"));
  }, []);

  return (
    <div className="container mt-4">
      <div className="card bg-dark text-light shadow-lg" style={{ borderRadius: 18 }}>
        <div className="card-body">
          <h2 className="mb-4">Products</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0" style={{ borderRadius: 12, overflow: "hidden" }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id} style={{ background: i % 2 ? "#222831" : "#1a202c" }}>
                    <td>{i + 1}</td>
                    <td>{p.name}</td>
                    <td>₹{p.price}</td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center">No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
