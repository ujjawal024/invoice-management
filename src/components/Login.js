import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        navigate("/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Login failed due to network error");
    }
  };

  return (
    <div className="login-bg d-flex align-items-center justify-content-center min-vh-100">
      <div className="login-card card p-4" style={{ maxWidth: 375, width: "100%" }}>
        <h3 className="mb-3">Admin Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <hr />
        <div className="text-center">
          Don't have an account?{" "}
          <button className="btn btn-link p-0" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
