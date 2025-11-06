import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AddInvoice() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([{ name: "", quantity: 1, price: 0 }]);
  const [customerName, setCustomerName] = useState("");
  const [customerDetails, setCustomerDetails] = useState({ email: "", phone: "+91" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [isNewCustomer, setIsNewCustomer] = useState(false);

  useEffect(() => {
    fetch("/api/customers", { credentials: "include" })
      .then(res => res.json())
      .then(data => setCustomers(data))
      .catch(() => setCustomers([]));

    fetch("/api/products", { credentials: "include" })
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  function onCustomerNameChange(e) {
    setCustomerName(e.target.value);
    const found = customers.find(
      c => c.name.trim().toLowerCase() === e.target.value.trim().toLowerCase()
    );
    if (found) {
      setIsNewCustomer(false);
      setCustomerDetails({ email: found.email, phone: found.phone });
    } else {
      setIsNewCustomer(true);
      setCustomerDetails({ email: "", phone: "+91" });
    }
  }

  function handleItemChange(idx, key, value) {
    setItems(items =>
      items.map((it, i) =>
        i === idx
          ? {
              ...it,
              [key]: value,
              price:
                key === "name"
                  ? (products.find(p => p.name === value)?.price || 0)
                  : it.price,
            }
          : it
      )
    );
  }
  function addItem() {
    setItems([...items, { name: "", quantity: 1, price: 0 }]);
  }
  function removeItem(idx) {
    setItems(items.filter((_, i) => i !== idx));
  }
  function calculateTotal() {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  }

  function isValidIndianPhone(phone) {
    // Matches +91 followed by 10 digits, and nothing else
    return /^\+91[6-9]\d{9}$/.test(phone);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const amount = calculateTotal();

    // Indian phone validation for new customer OR explicit customerDetails
    if (!isValidIndianPhone(customerDetails.phone)) {
      setError("Phone must be in Indian format: +919XXXXXXXXX");
      return;
    }

    try {
      let registerOk = true;
      if (isNewCustomer) {
        if (!customerDetails.email || !customerDetails.phone) {
          setError("Please fill email and phone for new customer!");
          return;
        }
        const resCust = await fetch("/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: customerName,
            email: customerDetails.email,
            phone: customerDetails.phone,
          }),
        });
        registerOk = resCust.ok;
        if (registerOk) {
          fetch("/api/customers", { credentials: "include" })
            .then(res => res.json())
            .then(data => setCustomers(data));
        }
      }
      if (!registerOk) {
        setError("Could not register new customer.");
        return;
      }

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          customer: customerName,
          customerEmail: customerDetails.email,
          customerPhone: customerDetails.phone,
          items,
          amount,
          status: "Draft",
          issueDate: new Date().toLocaleDateString('en-CA'),
          dueDate: new Date(+new Date() + 14*24*60*60*1000).toLocaleDateString('en-CA')
        }),
      });
      if (res.ok) {
        navigate("/dashboard");
      } else {
        setError("Could not create invoice.");
      }
    } catch {
      setError("Network error");
    }
  }

  return (
    <div className="container mt-4">
      <div className="card bg-dark text-light shadow-lg" style={{maxWidth: 650, margin: "0 auto", borderRadius: 18}}>
        <div className="card-body">
          <h3 className="mb-4">Add Invoice</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Customer Name</label>
              <input
                className="form-control"
                value={customerName}
                onChange={onCustomerNameChange}
                list="customerList"
                placeholder="Enter or select customer"
                autoComplete="off"
                required
              />
              <datalist id="customerList">
                {customers.map(c =>
                  <option key={c.id} value={c.name}/>
                )}
              </datalist>
            </div>
            {!isNewCustomer && customerDetails.email && (
              <div className="mb-2">
                <small>
                  <strong>Email:</strong> {customerDetails.email} <br/>
                  <strong>Phone:</strong> {customerDetails.phone}
                </small>
              </div>
            )}
            {isNewCustomer && (
              <div className="row">
                <div className="col-6 mb-2">
                  <label>Email</label>
                  <input
                    className="form-control"
                    type="email"
                    value={customerDetails.email}
                    onChange={e => setCustomerDetails({...customerDetails, email: e.target.value})}
                    required
                  />
                </div>
                <div className="col-6 mb-2">
                  <label>Phone</label>
                  <input
                    className="form-control"
                    type="tel"
                    placeholder="+919XXXXXXXXX"
                    value={customerDetails.phone}
                    pattern="\+91[6-9]{1}[0-9]{9}"
                    maxLength={13}
                    onChange={e => {
                      // Always keep "+91" at start
                      let v = e.target.value;
                      if (!v.startsWith("+91")) v = "+91" + v.replace(/^\+?91?/, '');
                      setCustomerDetails({...customerDetails, phone: v});
                    }}
                    required
                  />
                  <small className="text-secondary">Format: +919XXXXXXXXX</small>
                </div>
                <div className="mb-2"><small className="text-info">This customer will be registered!</small></div>
              </div>
            )}
            <div className="mb-3">
              <label>Items</label>
              {items.map((item, i) => (
                <div key={i} className="row mb-2 g-2 align-items-center">
                  <div className="col-5">
                    <select
                      className="form-control"
                      value={item.name}
                      onChange={e => handleItemChange(i, "name", e.target.value)}
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-3">
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={item.quantity}
                      onChange={e => handleItemChange(i, "quantity", parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>
                  <div className="col-3">
                    <input
                      type="text"
                      className="form-control"
                      value={item.price}
                      readOnly
                      placeholder="Price"
                    />
                  </div>
                  <div className="col-1 d-flex align-items-center">
                    {items.length > 1 &&
                      <button type="button" className="btn btn-sm btn-danger" onClick={() => removeItem(i)}>&times;</button>
                    }
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-secondary btn-sm mt-1" onClick={addItem}>
                Add Item
              </button>
            </div>
            <div className="mt-3">
              <strong>Total Amount: ₹{calculateTotal().toLocaleString()}</strong>
            </div>
            {error && <div className="alert alert-danger mt-2">{error}</div>}
            <button className="btn btn-primary mt-3" type="submit">
              Create Invoice
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddInvoice;
