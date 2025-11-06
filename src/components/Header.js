import React from 'react';

function Header() {
  return (
    <header className="px-4 py-3 d-flex align-items-center justify-content-between dashboard-header">
      <h2 className="text-light">Invoice Dashboard</h2>
      <div>
        <a className="btn btn-outline-light mx-2" href="/customers">Customers</a>
        <a className="btn btn-outline-light mx-2" href="/products">Products</a>
        <a className="btn btn-danger mx-2" href="/">Logout</a>
      </div>
    </header>
  );
}

export default Header;
