import React, { useState } from "react";
import useAuth from "./hooks/useAuth";

import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Users from "./components/Users";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  const auth = useAuth();
  const [view, setView] = useState("login");

  function handleLogin(token, role, id) {
    auth.setToken(token);
    auth.setRole(role || "user");
    if (id) auth.setUserId(id);
    else {
      try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        if (decoded.id) {
          auth.setUserId(decoded.id);
        }
      } catch {
        auth.setUserId(null);
      }
    }
    setView("profile");
  }

  function handleRegistered() {
    alert("Registered successfully. Please login.");
    setView("login");
  }

  const goto = (v) => setView(v);

  return (
    <div className="vh-100 d-flex flex-column">
      {/* ===== Navbar ===== */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary w-100">
        <div className="container-fluid">
          {/* App name on left */}
          <a
            className="navbar-brand fw-bold"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (auth.token) goto("profile");
            }}
          >
            BookMyStay
          </a>

          {/* Mobile toggle */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar links */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              {!auth.token && (
                <>
                  <li className="nav-item me-2">
                    <button
                      className="btn btn-outline-light"
                      onClick={() => goto("login")}
                    >
                      Login
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-light text-primary"
                      onClick={() => goto("register")}
                    >
                      Register
                    </button>
                  </li>
                </>
              )}

              {auth.token && (
                <>
                  <li className="nav-item me-2">
                    <button
                      className={`btn btn-light text-primary ${view === "profile" ? "fw-bold" : ""
                        }`}
                      onClick={() => goto("profile")}
                    >
                      My Profile
                    </button>
                  </li>

                  {auth.role === "admin" && (
                    <li className="nav-item me-2">
                      <button
                        className={`btn btn-light text-primary ${view === "users" ? "fw-bold" : ""
                          }`}
                        onClick={() => goto("users")}
                      >
                        Users
                      </button>
                    </li>
                  )}

                  <li className="nav-item d-flex align-items-center">
                    <span className="badge bg-light text-dark me-3">
                      {auth.role?.toUpperCase()}
                    </span>
                    <button
                      className="btn btn-outline-light"
                      onClick={() => {
                        auth.logout();
                        setView("login");
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* ===== Main content area ===== */}
      <div className="flex-grow-1 d-flex justify-content-center align-items-center bg-light">
        <div className="container">
          {!auth.token && view === "login" && (
            <Login
              onLogin={handleLogin}
              switchToRegister={() => goto("register")}
            />
          )}
          {!auth.token && view === "register" && (
            <Register
              onRegistered={handleRegistered}
              switchToLogin={() => goto("login")}
            />
          )}
          {auth.token && view === "profile" && <Profile auth={auth} />}
          {auth.token && view === "users" && <Users auth={auth} />}
        </div>
      </div>
    </div>
  );
}
