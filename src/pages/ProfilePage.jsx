import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authContext/AuthContext.jsx";
import { userService } from "../services/userService.js";
import SectionLabel from "../components/SectionLabel.jsx";
import FormField, { formInputClasses } from "../components/FormField.jsx";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordsMatch = newPassword && newPassword === confirmPassword;
  const canSubmit = currentPassword && newPassword.length >= 8 && passwordsMatch && !submitting;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setError(null);
    setSubmitting(true);
    try {
      await userService.updatePassword(currentPassword, newPassword);
      setSuccess(true);
      // Backend revokes the refresh token on a password change, so the
      // current session is dead either way — sign out locally and send
      // them to log back in with the new password.
      setTimeout(async () => {
        await logout();
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to update password");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-[480px]">
      <SectionLabel>Profile</SectionLabel>

      <div className="bg-canvas-light border-2 border-ink rounded shadow-[0_1px_2px_rgba(26,23,20,0.06),0_8px_24px_rgba(26,23,20,0.08)] p-6 mb-6">
        <div className="font-mono text-[10px] tracking-[2px] uppercase text-slate-light mb-3.5 pb-2.5 border-b border-line">
          Account
        </div>
        <div className="font-display font-bold text-xl">{user?.name}</div>
        <div className="font-mono text-[12.5px] text-slate mt-1">{user?.email}</div>
        {user?.role !== "USER" && (
          <div className="font-mono text-[10.5px] tracking-wide uppercase text-corner-red mt-2">{user?.role}</div>
        )}
      </div>

      <div className="bg-canvas-light border-2 border-ink rounded shadow-[0_1px_2px_rgba(26,23,20,0.06),0_8px_24px_rgba(26,23,20,0.08)] p-6">
        <div className="font-mono text-[10px] tracking-[2px] uppercase text-slate-light mb-3.5 pb-2.5 border-b border-line">
          Change Password
        </div>

        {success ? (
          <div className="font-mono text-[12.5px] text-corner-red">
            Password updated. Signing you out — please sign back in with your new password.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <FormField label="Current Password">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={formInputClasses}
                autoComplete="current-password"
              />
            </FormField>

            <FormField label="New Password">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={formInputClasses}
                autoComplete="new-password"
                minLength={8}
              />
            </FormField>

            <FormField label="Confirm New Password">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={formInputClasses}
                autoComplete="new-password"
              />
              {confirmPassword && !passwordsMatch && (
                <div className="font-mono text-[10.5px] text-corner-red mt-1.5">Passwords don't match</div>
              )}
            </FormField>

            {error && <div className="font-mono text-[11px] text-corner-red mb-3">{error}</div>}

            <button
              type="submit"
              disabled={!canSubmit}
              className={`font-display font-semibold uppercase text-[13px] px-5 py-3 rounded border-2 border-ink ${
                canSubmit ? "bg-ink text-canvas-light" : "opacity-40 cursor-not-allowed"
              }`}
            >
              {submitting ? "Updating…" : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
