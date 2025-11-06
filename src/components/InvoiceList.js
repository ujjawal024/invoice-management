import React, { useEffect, useState } from "react";

function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/invoices", { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error("Could not fetch invoices");
        return res.json();
      })
      .then(data => setInvoices(data))
      .catch(() => setError("Could not load invoices!"));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Invoices</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Customer</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv, i) => (
            <tr key={inv.id}>
              <td>{i + 1}</td>
              <td>{inv.customer}</td>
              <td>
                {Array.isArray(inv.items)
                  ? inv.items.map((item, idx) => (
                      <div key={idx}>
                        {item.name} x {item.quantity}
                      </div>
                    ))
                  : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InvoiceList;
