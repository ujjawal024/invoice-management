# 🧾 Invoice Management System

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-Python-000000?style=flat&logo=flask&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat&logo=mongodb&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=flat&logo=bootstrap&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat)

A full-stack web application for managing invoices, customers, and products — built with a **React** frontend and a **Flask + MongoDB** backend. Designed for small businesses and freelancers who need a clean, admin-secured invoice workflow.

---

## ✨ Features

- 🔐 **Admin Authentication** — Secure register/login with hashed passwords and session management
- 📊 **Dashboard** — At-a-glance metrics: Total Revenue, Paid Amount, Pending Amount, Overdue Invoices
- 🧾 **Invoice Management** — Create, update status, print, email, and delete invoices
- 👤 **Customer Management** — Add and list customers; auto-register new customers inline during invoice creation
- 📦 **Product Management** — Add and list products with auto-price fill in invoice line items
- 💰 **INR Currency Formatting** — All monetary values displayed in Indian Rupees (₹)
- 📈 **Trend Indicators** — Dashboard cards show percentage change with color-coded up/down arrows
- 🖨️ **Print Invoice** — Opens a formatted print-ready invoice in a new window
- 📧 **Email Invoice** — Opens default mail client with pre-filled subject and body

---

## 🏗️ Project Structure

```
invoicemanagement/
├── backend/                   # Flask API server
│   ├── app.py                 # Main application — routes, auth, CRUD APIs
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables (MongoDB URI, Secret Key)
│
├── src/                       # React frontend
│   ├── App.js                 # Root router — defines all page routes
│   ├── index.js               # React entry point
│   ├── components/
│   │   ├── Login.js           # Admin login page
│   │   ├── Register.js        # Admin registration page
│   │   ├── Dashboard.js       # Main dashboard with stats + invoice table
│   │   ├── CustomerList.js    # List of all customers
│   │   ├── AddCustomer.js     # Form to add a new customer
│   │   ├── ProductList.js     # List of all products
│   │   ├── AddProduct.js      # Form to add a new product
│   │   ├── InvoiceList.js     # Invoice listing page
│   │   ├── AddInvoice.js      # Form to create a new invoice
│   │   ├── Header.js          # Top navigation bar
│   │   ├── Sidebar.js         # Side navigation menu
│   │   └── UserBanner.js      # User info banner
│   └── styles/
│       └── theme.css          # Global dark theme CSS
│
├── public/                    # Static public assets
├── package.json               # React/Node dependencies and scripts
└── .gitignore
```

---

## 🛠️ Tech Stack

| Layer    | Technology                                                  |
|----------|-------------------------------------------------------------|
| Frontend | React 19, React Router DOM 7, Bootstrap 5, Bootstrap Icons  |
| Backend  | Python, Flask, Flask-PyMongo, Flask-CORS                    |
| Database | MongoDB (via PyMongo)                                       |
| Auth     | Werkzeug password hashing, Flask sessions                   |
| Config   | python-dotenv (`.env` file)                                 |

---

## ⚡ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.8+)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port `27017`

---

### 1. Clone the Repository

```bash
git clone https://github.com/ujjawal024/invoice-management.git
cd invoicemanagement
```

---

### 2. Backend Setup (Flask)

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install Python dependencies
pip install -r requirements.txt
```

#### Configure Environment Variables

Create or edit `backend/.env` with your own values:

```env
MONGO_URI=mongodb://localhost:27017/invoicemanager
SECRET_KEY=your_super_secret_key_here
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

#### Start the Flask Server

```bash
python app.py
```

The backend will be available at `http://localhost:5000`.

---

### 3. Frontend Setup (React)

Open a **new terminal** from the project root:

```bash
# Install Node dependencies
npm install

# Start the React development server
npm start
```

The React app will open at `http://localhost:3000` and automatically proxy all `/api/*` requests to the Flask backend on port `5000`.

---

## 🔌 API Reference

All endpoints are prefixed with `/api/`. Protected routes require an active admin session — login first.

### Auth

| Method | Endpoint        | Description               |
|--------|-----------------|---------------------------|
| POST   | `/api/register` | Register a new admin      |
| POST   | `/api/login`    | Login with email/password |
| POST   | `/api/logout`   | Logout and clear session  |

### Customers *(protected)*

| Method | Endpoint         | Description           |
|--------|------------------|-----------------------|
| GET    | `/api/customers` | Get all customers     |
| POST   | `/api/customers` | Create a new customer |

### Products *(protected)*

| Method | Endpoint        | Description          |
|--------|-----------------|----------------------|
| GET    | `/api/products` | Get all products     |
| POST   | `/api/products` | Create a new product |

### Invoices *(protected)*

| Method | Endpoint              | Description                     |
|--------|-----------------------|---------------------------------|
| GET    | `/api/invoices`       | Get all invoices                |
| POST   | `/api/invoices`       | Create a new invoice            |
| PUT    | `/api/invoices/<id>`  | Update an invoice (e.g. status) |
| DELETE | `/api/invoices/<id>`  | Delete an invoice               |

---

## 🔐 Security

- Passwords are **hashed** using Werkzeug's `generate_password_hash` before being stored.
- All protected routes use a session-based `login_required` decorator.
- Each admin's data (customers, products, invoices) is **isolated** by their `admin_id` — no cross-admin data leakage.
- CORS is enabled with `supports_credentials=True` to allow cookie-based sessions between the React dev server and Flask.
- **Never commit your `.env` file** — it is listed in `.gitignore`.

---

## 📋 Invoice Statuses

Invoices support four statuses, changeable directly from the dashboard:

| Status    | Description                      |
|-----------|----------------------------------|
| `Draft`   | Invoice created but not yet sent |
| `Pending` | Invoice sent, awaiting payment   |
| `Paid`    | Payment received                 |
| `Overdue` | Payment deadline has passed      |

---

## 🧩 Key Workflows

### Creating an Invoice
1. Navigate to **Add Invoice** from the dashboard.
2. Type or select an existing customer name — if new, contact details are collected inline and the customer is auto-registered.
3. Select products from the dropdown; prices are auto-filled.
4. Add multiple line items with quantities.
5. The total is calculated automatically.
6. Submit to create the invoice with a 14-day due date.

### Printing an Invoice
- Click the 🖨️ print icon on any invoice row in the dashboard table.
- A formatted, print-ready HTML page opens in a new browser window.

### Emailing an Invoice
- Click the ✉️ email icon on any invoice row.
- Your system's default email client opens with the invoice summary pre-filled.

---

## 🚧 Development Notes

- The React app uses `"proxy": "http://localhost:5000"` in `package.json` to forward all `/api/*` calls to Flask during development.
- Flask runs in `debug=True` mode for auto-reload — **disable this in production**.
- MongoDB ObjectIds are converted to plain strings before being sent to the frontend.

---

## 📦 Dependencies

### Frontend (`package.json`)

| Package            | Version   | Purpose                    |
|--------------------|-----------|----------------------------|
| `react`            | ^19.2.0   | UI library                 |
| `react-dom`        | ^19.2.0   | DOM rendering              |
| `react-router-dom` | ^7.9.4    | Client-side routing        |
| `bootstrap`        | ^5.3.8    | CSS framework              |
| `react-bootstrap`  | ^2.10.10  | Bootstrap React components |

### Backend (`requirements.txt`)

| Package          | Purpose                                |
|------------------|----------------------------------------|
| `Flask`          | Web framework                          |
| `Flask-Cors`     | Cross-Origin Resource Sharing          |
| `Flask-PyMongo`  | MongoDB integration for Flask          |
| `Werkzeug`       | Password hashing utilities             |
| `python-dotenv`  | Load environment variables from `.env` |

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Ujjawal** — [GitHub](https://github.com/ujjawal024)
