import React, { useState } from "react";
import { apiFetch } from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Register({ onRegistered, switchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await apiFetch("/users/register", "POST", { name, email, password, role });
      onRegistered();
    } catch (error) {
      setErr(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "26rem" }}>
        <h2 className="text-center mb-4">Register</h2>

        {err && <div className="alert alert-danger text-center">{err}</div>}

        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@email.com"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter a strong password"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <div className="d-flex justify-content-between">
            <button
              type="submit"
              className="btn btn-primary w-50 me-2"
              disabled={loading}
            >
              {loading ? "..." : "Register"}
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary w-50"
              onClick={switchToLogin}
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
