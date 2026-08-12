import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService.js";
import { formInputClasses } from "../components/FormField.jsx";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const passwordsMatch = newPassword && newPassword === confirmPassword;
  const canSubmit = userId && token && newPassword.length >= 8 && passwordsMatch && !submitting;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      await authService.resetPassword(userId, token, newPassword);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "This reset link is invalid or has expired.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-[420px] mx-auto">
      <div className="bg-canvas-light border-2 border-ink rounded shadow-[0_1px_2px_rgba(26,23,20,0.06),0_8px_24px_rgba(26,23,20,0.08)] p-6">
        <div className="font-display font-bold text-2xl uppercase mb-1">Reset Password</div>

        {!userId || !token ? (
          <div className="font-mono text-[12.5px] text-corner-red mt-3">
            This reset link is missing or malformed. Request a new one from the{" "}
            <Link to="/forgot-password" className="underline">
              forgot password
            </Link>{" "}
            page.
          </div>
        ) : success ? (
          <div className="font-mono text-[12.5px] text-ink mt-3">Password updated. Redirecting you to sign in…</div>
        ) : (
          <>
            <div className="font-mono text-[11px] text-slate mb-5">Choose a new password for your account.</div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="font-mono text-[10.5px] tracking-wide uppercase text-slate block mb-1.5">New Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={formInputClasses}
                  autoComplete="new-password"
                />
              </div>
              <div className="mb-4">
                <label className="font-mono text-[10.5px] tracking-wide uppercase text-slate block mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={formInputClasses}
                  autoComplete="new-password"
                />
                {confirmPassword && !passwordsMatch && (
                  <div className="font-mono text-[10.5px] text-corner-red mt-1.5">Passwords don't match</div>
                )}
              </div>

              {error && <div className="font-mono text-[11px] text-corner-red mb-3">{error}</div>}

              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full font-display font-semibold uppercase text-[13px] px-5 py-3 rounded border-2 border-ink ${
                  canSubmit ? "bg-ink text-canvas-light" : "opacity-40 cursor-not-allowed"
                }`}
              >
                {submitting ? "Updating…" : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
