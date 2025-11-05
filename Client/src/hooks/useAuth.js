import { useState, useEffect } from "react";

export default function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));
  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");

    if (role) localStorage.setItem("role", role);
    else localStorage.removeItem("role");

    if (userId) localStorage.setItem("userId", userId);
    else localStorage.removeItem("userId");
  }, [token, role, userId]);

  const logout = () => {
    setToken(null);
    setRole(null);
    setUserId(null);
  };

  return { token, setToken, role, setRole, userId, setUserId, logout };
}
