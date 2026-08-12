import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../authContext/AuthContext.jsx";
import { formInputClasses } from "../components/FormField.jsx";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-[420px] mx-auto">
      <div className="bg-canvas-light border-2 border-ink rounded shadow-[0_1px_2px_rgba(26,23,20,0.06),0_8px_24px_rgba(26,23,20,0.08)] p-6">
        <div className="font-display font-bold text-2xl uppercase mb-1">Create Account</div>
        <div className="font-mono text-[11px] text-slate mb-5">Keep your scorecards synced across devices.</div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="font-mono text-[10.5px] tracking-wide uppercase text-slate block mb-1.5">Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={formInputClasses} />
          </div>
          <div className="mb-4">
            <label className="font-mono text-[10.5px] tracking-wide uppercase text-slate block mb-1.5">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={formInputClasses} />
          </div>
          <div className="mb-4">
            <label className="font-mono text-[10.5px] tracking-wide uppercase text-slate block mb-1.5">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={formInputClasses}
            />
          </div>

          {error && <div className="font-mono text-[11px] text-corner-red mb-3">{error}</div>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full font-display font-semibold uppercase text-[13px] px-5 py-3 rounded border-2 border-ink bg-ink text-canvas-light disabled:opacity-50"
          >
            {submitting ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <div className="font-mono text-[11px] text-slate mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="underline text-corner-red">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
