import React from 'react';

function Sidebar() {
  return (
    <nav className="sidebar bg-dark p-3" style={{ minWidth: "180px", height: "100vh" }}>
      <ul className="list-unstyled">
        <li className="mb-3"><a href="/dashboard" className="sidebar-link text-light">Dashboard</a></li>
        <li className="mb-3"><a href="/customers" className="sidebar-link text-light">Customers</a></li>
        <li className="mb-3"><a href="/products" className="sidebar-link text-light">Products</a></li>
      </ul>
    </nav>
  );
}

export default Sidebar;
