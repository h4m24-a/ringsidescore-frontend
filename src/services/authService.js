import { api } from "./api.js";

export const authService = {
  // POST /auth/register — returns { user, accessToken }; refresh token is
  // set as an httpOnly cookie by the server, never touched here.
  register: (name, email, password) => api.post("/auth/register", { name, email, password }, { auth: false }),

  // POST /auth/login — returns { user, accessToken }
  login: (email, password) => api.post("/auth/login", { email, password }, { auth: false }),

  // POST /auth/refresh — no body; the refresh cookie does the work. Used on
  // app load to silently restore a session, and by api.js on 401s.
  refresh: () => api.post("/auth/refresh", undefined, { auth: false }),

  // POST /auth/logout — revokes the stored refresh token server-side and
  // clears the cookie.
  logout: () => api.post("/auth/logout", undefined, { auth: false }),

  // GET /auth/me — returns the current user from the access token
  me: () => api.get("/auth/me"),

  // POST /auth/forgot-password — body: { email }. Always resolves with a
  // generic message whether or not the email exists (the backend won't
  // reveal which emails are registered).
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }, { auth: false }),

  // POST /auth/reset-password — body: { userId, token, newPassword }.
  // userId + token come from the link in the reset email.
  resetPassword: (userId, token, newPassword) =>
    api.post("/auth/reset-password", { userId, token, newPassword }, { auth: false }),
};
