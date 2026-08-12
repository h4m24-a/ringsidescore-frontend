import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../services/authService.js";
import { formInputClasses } from "../components/FormField.jsx";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await authService.forgotPassword(email);
      // Backend always responds the same way whether or not the email
      // exists — shown as-is here rather than a custom "sent!" message, so
      // the frontend doesn't leak anything extra either.
      setSent(true);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-[420px] mx-auto">
      <div className="bg-canvas-light border-2 border-ink rounded shadow-[0_1px_2px_rgba(26,23,20,0.06),0_8px_24px_rgba(26,23,20,0.08)] p-6">
        <div className="font-display font-bold text-2xl uppercase mb-1">Forgot Password</div>
        <div className="font-mono text-[11px] text-slate mb-5">
          Enter the email on your account and we'll send a link to reset your password.
        </div>

        {sent ? (
          <div className="font-mono text-[12.5px] text-ink">
            If that email is registered, a password reset link has been sent. Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="font-mono text-[10.5px] tracking-wide uppercase text-slate block mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={formInputClasses}
              />
            </div>

            {error && <div className="font-mono text-[11px] text-corner-red mb-3">{error}</div>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full font-display font-semibold uppercase text-[13px] px-5 py-3 rounded border-2 border-ink bg-ink text-canvas-light disabled:opacity-50"
            >
              {submitting ? "Sending…" : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="font-mono text-[11px] text-slate mt-4 text-center">
          <Link to="/login" className="underline text-corner-red">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
