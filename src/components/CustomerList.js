import React, { useEffect, useState } from "react";

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/customers", { credentials: "include" })
      .then(res => res.json())
      .then(data => setCustomers(data))
      .catch(() => setError("Could not load customers!"));
  }, []);

  return (
    <div className="container mt-4">
      <div className="card bg-dark text-light shadow-lg" style={{ borderRadius: 18 }}>
        <div className="card-body">
          <h2 className="mb-4">Customers</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0" style={{ borderRadius: 12, overflow: "hidden" }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c, i) => (
                  <tr key={c.id} style={{ background: i % 2 ? "#222831" : "#1a202c" }}>
                    <td>{i + 1}</td>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center">No customers found.</td>
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

export default CustomerList;
