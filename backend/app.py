import os
from flask import Flask, request, jsonify, session
from flask_pymongo import PyMongo
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId
from dotenv import load_dotenv
from functools import wraps

load_dotenv()

app = Flask(__name__)
app.config["MONGO_URI"] = os.environ.get("MONGO_URI", "mongodb://localhost:27017/invoicemanager")
app.secret_key = os.environ.get("SECRET_KEY", "choose_a_complex_random_string")
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
CORS(app, supports_credentials=True)
mongo = PyMongo(app)

# Utils
def to_json(doc):
    doc = dict(doc)
    doc["id"] = str(doc.pop("_id"))
    return doc

# ---- Auth check decorator ----
def login_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if "admin_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401
        return fn(*args, **kwargs)
    return wrapper

# ---- Auth ----
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Missing email or password"}), 400
    if mongo.db.admins.find_one({"email": data["email"]}):
        return jsonify({"error": "Email already exists"}), 409
    hashed = generate_password_hash(data["password"])
    admin = {
        "email": data["email"],
        "password": hashed,
        "name": data.get("name", ""),
    }
    mongo.db.admins.insert_one(admin)
    return jsonify({"success": True})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    admin = mongo.db.admins.find_one({"email": data["email"]})
    if not admin or not check_password_hash(admin["password"], data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401
    session["admin_id"] = str(admin["_id"])
    session["email"] = admin["email"]
    return jsonify({
        "success": True,
        "id": str(admin["_id"]),
        "email": admin["email"],
        "name": admin.get("name", "")
    })

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"success": True})

# ---- Customers ----
@app.route('/api/customers', methods=['GET'])
@login_required
def get_customers():
    admin_id = session["admin_id"]
    customers = list(mongo.db.customers.find({"admin_id": admin_id}))
    return jsonify([to_json(c) for c in customers])

@app.route('/api/customers', methods=['POST'])
@login_required
def create_customer():
    admin_id = session["admin_id"]
    data = request.json
    data["admin_id"] = admin_id
    mongo.db.customers.insert_one(data)
    return jsonify({"success": True})

# ---- Products ----
@app.route('/api/products', methods=['GET'])
@login_required
def get_products():
    admin_id = session["admin_id"]
    products = list(mongo.db.products.find({"admin_id": admin_id}))
    return jsonify([to_json(p) for p in products])

@app.route('/api/products', methods=['POST'])
@login_required
def create_product():
    admin_id = session["admin_id"]
    data = request.json
    data["admin_id"] = admin_id
    mongo.db.products.insert_one(data)
    return jsonify({"success": True})

# ---- Invoices ----
@app.route('/api/invoices', methods=['GET'])
@login_required
def get_invoices():
    admin_id = session["admin_id"]
    invoices = list(mongo.db.invoices.find({"admin_id": admin_id}))
    return jsonify([to_json(i) for i in invoices])

@app.route('/api/invoices', methods=['POST'])
@login_required
def create_invoice():
    admin_id = session["admin_id"]
    data = request.json
    data["admin_id"] = admin_id
    mongo.db.invoices.insert_one(data)
    return jsonify({"success": True})

@app.route('/api/invoices/<invoice_id>', methods=['PUT'])
@login_required
def update_invoice(invoice_id):
    admin_id = session["admin_id"]
    data = request.json
    mongo.db.invoices.update_one(
        {"_id": ObjectId(invoice_id), "admin_id": admin_id}, {"$set": data}
    )
    return jsonify({"success": True})

@app.route('/api/invoices/<invoice_id>', methods=['DELETE'])
@login_required
def delete_invoice(invoice_id):
    admin_id = session["admin_id"]
    mongo.db.invoices.delete_one({"_id": ObjectId(invoice_id), "admin_id": admin_id})
    return jsonify({"success": True})

if __name__ == "__main__":
    app.run(debug=True)
