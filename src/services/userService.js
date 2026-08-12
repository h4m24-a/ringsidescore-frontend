import { api } from "./api.js";

export const userService = {
  // PATCH /users/me/password — requires the current password (unlike
  // authService's forgot/reset-password flow, which uses an emailed token
  // instead). Backend also revokes the refresh token on success, so the
  // person needs to sign back in afterward.
  updatePassword: (currentPassword, newPassword) => api.patch("/users/me/password", { currentPassword, newPassword }),

  // GET /users/me/accuracy — already exposed by the backend; included here
  // for symmetry if the profile page wants to show it later.
  myAccuracy: () => api.get("/users/me/accuracy"),
};
