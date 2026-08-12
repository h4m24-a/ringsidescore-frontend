import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../authContext/AuthContext.jsx";

export default function ProtectedRoute({ children, requireOrganizer = false }) {
  const { user, loading, isOrganizer } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="font-mono text-sm text-slate-light text-center py-16">Loading…</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireOrganizer && !isOrganizer) {
    return <Navigate to="/" replace />;
  }

  return children;
}
