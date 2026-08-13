import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authService } from "../services/authService.js";
import { setAccessToken, setOnAuthExpired } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // On mount: no token lives in localStorage anymore — instead, silently
  // hit /auth/refresh, which reads the httpOnly cookie. If it's still valid
  // we get a fresh access token and the user back; if not, we're logged out.
  useEffect(() => {
    const wasAuth = localStorage.getItem("isAuthenticated") === "true";
    if (!wasAuth) {
      setAccessToken(null);
      setUser(null);
      setLoading(false);
    } else {
      authService
        .refresh()
        .then((data) => {
          setAccessToken(data.accessToken);
          setUser(data.user);
          localStorage.setItem("isAuthenticated", "true");
        })
        .catch(() => {
          setAccessToken(null);
          setUser(null);
          localStorage.removeItem("isAuthenticated");
        })
        .finally(() => setLoading(false));
    }

    // If a background request's silent refresh (triggered from api.js on a
    // 401) ever fails, drop back to signed-out state instead of leaving the
    // UI thinking it's still logged in.
    setOnAuthExpired(() => {
      setAccessToken(null);
      setUser(null);
    });
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const data = await authService.login(email, password);
      setAccessToken(data.accessToken);
      setUser(data.user);
        localStorage.setItem("isAuthenticated", "true");
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setError(null);
    try {
      const data = await authService.register(name, email, password);
      setAccessToken(data.accessToken);
      setUser(data.user);
        localStorage.setItem("isAuthenticated", "true");
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // even if the network call fails, still clear local state below
    }
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("isAuthenticated");
  }, []);

  // Roles come back from the backend as uppercase Prisma enum values.
  const isOrganizer = user?.role === "ORGANIZER" || user?.role === "ADMIN";

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, isOrganizer }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
