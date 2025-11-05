import React, { useState } from "react";
import { apiFetch } from "../api";
import "bootstrap/dist/css/bootstrap.min.css";


import hero from "../assets/image/login_image.jpg";

export default function Login({ onLogin, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const data = await apiFetch("/users/login", "POST", { email, password });
      onLogin(data.token, data.role, data.userId || data.userId);
    } catch (error) {
      setErr(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-fluid vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row shadow-sm rounded overflow-hidden" style={{ minHeight: "70vh" }}>
          {/* Left: Image (hidden on small screens) */}
          <div className="col-md-6 d-none d-md-block p-0">
            <img
              src={hero}
              alt="BookMyStay"
              className="img-fluid h-100 w-100"
              style={{ objectFit: "cover", display: "block" }}
            />
          </div>

          {/* Right: Login Card */}
          <div className="col-12 col-md-6 d-flex justify-content-center align-items-center p-4">
            <div className="card shadow" style={{ width: "100%", maxWidth: 520 }}>
              <div className="card-body p-4">
                <h2 className="text-center mb-4">Login</h2>

                {err && <div className="alert alert-danger text-center">{err}</div>}

                <form onSubmit={submit}>
                  <div className="mb-3">
                    <label className="form-label">Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
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
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary flex-grow-1"
                      disabled={loading}
                    >
                      {loading ? "..." : "Login"}
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={switchToRegister}
                    >
                      Register
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div> {/* row */}
      </div> {/* container */}
    </div> /* full height */
  );
}
