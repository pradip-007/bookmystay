import React, { useState, useEffect } from "react";
import { apiFetch } from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Users({ auth }) {
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const data = await apiFetch("/users", "GET", null, auth.token);
      setUsers(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (auth.token && auth.role === "admin") load();
  }, [auth.token, auth.role]);

  async function del(id) {
    if (!window.confirm("Delete this user?")) return;
    try {
      await apiFetch(`/users/delete/${id}`, "DELETE", null, auth.token);
      setUsers((prev) => prev.filter((u) => u.user_id !== id));
    } catch (e) {
      alert("Delete failed: " + e.message);
    }
  }

  // ----- UI states -----
  if (auth.role !== "admin")
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="alert alert-danger text-center">
          Admin access required to view this page.
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

  // ----- Main table -----
  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">All Users</h4>
          <span className="badge bg-light text-dark">Admin Panel</span>
        </div>

        <div className="card-body">
          {users.length === 0 ? (
            <p className="text-center text-muted">No users found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead className="table-primary">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.user_id}>
                      <td>{u.user_id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone || "-"}</td>
                      <td>
                        <span
                          className={`badge ${
                            u.role === "admin"
                              ? "bg-danger"
                              : u.role === "manager"
                              ? "bg-warning text-dark"
                              : "bg-secondary"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-info me-2"
                          onClick={() =>
                            window.alert(JSON.stringify(u, null, 2))
                          }
                        >
                          View
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => del(u.user_id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
