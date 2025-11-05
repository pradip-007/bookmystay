import React, { useState, useEffect } from "react";
import { apiFetch } from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Profile({ auth }) {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      let userId = 0;
      if (!auth.userId) {
        const payload = auth.token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        userId = decoded.id;
      }
      const id = auth.userId || userId;
      const data = await apiFetch(`/users/${id}`, "GET", null, auth.token);
      setProfile(data);
      setForm({
        name: data.name,
        email: data.email,
        phone: data.phone || "",
      });
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (auth.token) load();
  }, [auth.token]);

  async function save(e) {
    e.preventDefault();
    setErr(null);
    try {
      await apiFetch(
        `/users/update/${profile.user_id}`,
        "PUT",
        { ...form, role: profile.role },
        auth.token
      );
      setEditing(false);
      await load();
    } catch (e) {
      setErr(e.message);
    }
  }

  // ---- UI States ----
  if (!auth.token)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="alert alert-warning text-center w-50">
          Please login to view your profile.
        </div>
      </div>
    );

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (err)
    return (
      <div className="alert alert-danger text-center mt-4 container">{err}</div>
    );

  if (!profile) return null;

  // ---- Main Card ----
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "30rem" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="text-primary mb-0">My Profile</h4>
          <span
            className={`badge ${
              profile.role === "admin"
                ? "bg-danger"
                : profile.role === "manager"
                ? "bg-warning text-dark"
                : "bg-secondary"
            }`}
          >
            {profile.role.toUpperCase()}
          </span>
        </div>

        {!editing ? (
          <>
            <ul className="list-group list-group-flush mb-3">
              <li className="list-group-item">
                <strong>Name:</strong> {profile.name}
              </li>
              <li className="list-group-item">
                <strong>Email:</strong> {profile.email}
              </li>
              <li className="list-group-item">
                <strong>Phone:</strong> {profile.phone || "-"}
              </li>
            </ul>

            <div className="text-center">
              <button
                className="btn btn-primary"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={save}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-success w-50 me-2">
                Save
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary w-50"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
