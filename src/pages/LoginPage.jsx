import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../authContext/AuthContext.jsx";
import { formInputClasses } from "../components/FormField.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/";

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-[420px] mx-auto">
      <div className="bg-canvas-light border-2 border-ink rounded shadow-[0_1px_2px_rgba(26,23,20,0.06),0_8px_24px_rgba(26,23,20,0.08)] p-6">
        <div className="font-display font-bold text-2xl uppercase mb-1">Sign In</div>
        <div className="font-mono text-[11px] text-slate mb-5">Access your scorecards and (if you're an organizer) event management.</div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="font-mono text-[10.5px] tracking-wide uppercase text-slate block mb-1.5">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={formInputClasses} />
          </div>
          <div className="mb-4">
            <label className="font-mono text-[10.5px] tracking-wide uppercase text-slate block mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={formInputClasses}
            />
            <div className="text-right mt-1.5">
              <Link to="/forgot-password" className="font-mono text-[10.5px] text-slate-light underline">
                Forgot password?
              </Link>
            </div>
          </div>

          {error && <div className="font-mono text-[11px] text-corner-red mb-3">{error}</div>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full font-display font-semibold uppercase text-[13px] px-5 py-3 rounded border-2 border-ink bg-ink text-canvas-light disabled:opacity-50"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="font-mono text-[11px] text-slate mt-4 text-center">
          No account?{" "}
          <Link to="/register" className="underline text-corner-red">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
