import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Dashboard() {
  const inrFormat = amount =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  // Helper to compute percent change
  const percentDiff = (current, last) => {
    if (!last) return "N/A";
    const diff = ((current - last) / Math.abs(last)) * 100;
    const up = diff >= 0;
    return (
      <span className={up ? 'text-success' : 'text-danger'}>
        <i className={`bi bi-arrow-${up ? 'up' : 'down'}-right-circle me-1`}></i>
        {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
      </span>
    );
  };

  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    paidAmount: 0,
    pendingAmount: 0,
    overdueCount: 0,
  });

  const fetchInvoices = () => {
    fetch("/api/invoices", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setInvoices(data);
        calculateStats(data);
      })
      .catch(() => console.error("Could not load invoices"));
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const calculateStats = (invoices) => {
    let totalRevenue = 0;
    let paidAmount = 0;
    let pendingAmount = 0;
    let overdueCount = 0;

    invoices.forEach(inv => {
      const amount = inv.amount || 0;
      totalRevenue += amount;

      if (inv.status === "Paid") paidAmount += amount;
      else if (inv.status === "Pending") pendingAmount += amount;
      else if (inv.status === "Overdue") overdueCount++;
    });

    setStats({ totalRevenue, paidAmount, pendingAmount, overdueCount });
  };

  const handleStatusChange = async (invoiceId, newStatus) => {
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchInvoices(); // Refresh data
      } else {
        alert("Failed to update status");
      }
    } catch {
      alert("Network error");
    }
  };

  const handleDelete = async (invoiceId, customerName) => {
    if (window.confirm(`Are you sure you want to delete invoice for ${customerName}?`)) {
      try {
        const res = await fetch(`/api/invoices/${invoiceId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) {
          fetchInvoices(); // Refresh data
        } else {
          alert("Failed to delete invoice");
        }
      } catch {
        alert("Network error");
      }
    }
  };

  const handlePrint = (invoice) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${invoice.customer}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Invoice</h1>
          <p><strong>Customer:</strong> ${invoice.customer}</p>
          <p><strong>Amount:</strong> ${inrFormat(invoice.amount || 0)}</p>
          <p><strong>Status:</strong> ${invoice.status || 'Draft'}</p>
          <p><strong>Issue Date:</strong> ${invoice.issueDate || 'N/A'}</p>
          <p><strong>Due Date:</strong> ${invoice.dueDate || 'N/A'}</p>
          <h3>Items:</h3>
          <table>
            <tr><th>Item</th><th>Quantity</th><th>Price</th></tr>
            ${invoice.items?.map(item => `
              <tr><td>${item.name}</td><td>${item.quantity}</td><td>₹${item.price}</td></tr>
            `).join('') || '<tr><td colspan="3">No items</td></tr>'}
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleEmail = (invoice) => {
    const subject = `Invoice for ${invoice.customer}`;
    const body = `Dear ${invoice.customer},\n\nYour invoice amount is ${inrFormat(invoice.amount || 0)}.\n\nStatus: ${invoice.status || 'Draft'}\nDue Date: ${invoice.dueDate || 'N/A'}\n\nThank you!`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Calculate previous period values and trends here
  const lastRevenue = invoices.length > 1
    ? invoices.slice(0, -1).reduce((t, i) => t + (i.amount || 0), 0)
    : 0;

  const trendRevenue = percentDiff(stats.totalRevenue, lastRevenue);

  const lastPaid = invoices.filter(i => i.status === "Paid").slice(0, -1).reduce((t, i) => t + (i.amount || 0), 0);
  const trendPaid = percentDiff(stats.paidAmount, lastPaid);

  const lastPending = invoices.filter(i => i.status === "Pending").slice(0, -1).reduce((t, i) => t + (i.amount || 0), 0);
  const trendPending = percentDiff(stats.pendingAmount, lastPending);

  const cardData = [
    {
      title: "Total Revenue",
      amount: stats.totalRevenue,
      info: `${invoices.length} invoices total`,
      bgClass: "bg-gradient-dark-blue",
      trend: trendRevenue
    },
    {
      title: "Paid Amount",
      amount: stats.paidAmount,
      info: `${invoices.filter(i => i.status === "Paid").length} payments`,
      bgClass: "bg-gradient-dark-green",
      trend: trendPaid
    },
    {
      title: "Pending Amount",
      amount: stats.pendingAmount,
      info: `${invoices.filter(i => i.status === "Pending").length} awaiting`,
      bgClass: "bg-gradient-dark-yellow",
      trend: trendPending
    },
    {
      title: "Overdue Invoices",
      amount: stats.overdueCount,
      info: "Require immediate attention",
      bgClass: "bg-gradient-dark-red",
      trend: <span>-</span>
    }
  ];

  return (
    <div className="dashboard-bg d-flex min-vh-100">
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <main className="p-4">
          {/* Stats Cards */}
          <div className="row g-4 align-items-stretch mb-4">
            {cardData.map((card, idx) => (
              <div className="col-md-3" key={idx}>
                <div className={`card card-summary shadow-sm ${card.bgClass} text-light h-100 position-relative`}>
                  <div className="card-body">
                    <h6 className="mb-2 fw-normal opacity-75">{card.title}</h6>
                    <h2 className="fw-bold mb-1">
                      {typeof card.amount === 'number' && idx !== 3
                        ? inrFormat(card.amount)
                        : card.amount}
                    </h2>
                    <div className="mb-3">{card.info}</div>
                    <div className="trend mt-2">{card.trend}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mb-4 d-flex flex-wrap gap-3">
            <button onClick={() => navigate('/add-customer')} className="btn btn-primary">
              <i className="bi bi-person-plus me-2"></i>Add Customer
            </button>
            <button onClick={() => navigate('/add-product')} className="btn btn-primary">
              <i className="bi bi-box-seam me-2"></i>Add Product
            </button>
            <button onClick={() => navigate('/add-invoice')} className="btn btn-primary">
              <i className="bi bi-file-earmark-plus me-2"></i>Add Invoice
            </button>
          </div>

          {/* Invoices Table */}
          <div className="card bg-dark text-light">
            <div className="card-body">
              <h4 className="mb-4">Invoices</h4>
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Invoice #</th>
                      <th>Client</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Issue Date</th>
                      <th>Due Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv, i) => (
                      <tr key={inv.id}>
                        <td>{`INV-${new Date().getFullYear()}-${String(i + 1).padStart(3, '0')}`}</td>
                        <td>{inv.customer || "N/A"}</td>
                        <td>{inrFormat(inv.amount || 0)}</td>
                        <td>
                          <div className="d-inline-block" style={{ minWidth: 110 }}>
                            <select
                              className="form-select form-select-sm rounded-pill px-2 py-1 border-secondary"
                              style={{ background: "#222", color: "#fff", width: 110 }}
                              value={inv.status || "Draft"}
                              onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                            >
                              <option value="Draft">Draft</option>
                              <option value="Pending">Pending</option>
                              <option value="Paid">Paid</option>
                              <option value="Overdue">Overdue</option>
                            </select>
                          </div>
                        </td>
                        <td>{inv.issueDate || "Jan 1, 2024"}</td>
                        <td>{inv.dueDate || "Jan 15, 2024"}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-light me-1" onClick={() => handlePrint(inv)} title="Print">
                            <i className="bi bi-printer"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-light me-1" onClick={() => handleEmail(inv)} title="Email">
                            <i className="bi bi-envelope"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(inv.id, inv.customer)} title="Delete">
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {invoices.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center">No invoices found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
