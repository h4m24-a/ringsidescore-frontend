import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../authContext/AuthContext.jsx";

function NavTab({ to, children }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `px-4 py-2.5 font-display font-semibold text-[13px] tracking-wide uppercase border-r-2 border-ink last:border-r-0 ${
          isActive ? "bg-ink text-canvas-light" : "bg-canvas-light text-ink hover:bg-[#e2dac6]"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Masthead() {
  const location = useLocation();
  const { user, isOrganizer, logout } = useAuth();
  const onManageFlow = location.pathname.startsWith("/manage");

  return (
    <div className="flex items-start lg:items-end justify-center lg:justify-between mb-7 pb-4 border-b-[3px] border-ink flex-wrap gap-3.5">
      <div>
        <div className="font-display font-bold text-[34px] tracking-wide text-center lg:text-left uppercase leading-none">
          RING<span className="text-corner-red">SIDE</span>
        </div>
        <div className="font-mono text-[11px] tracking-[1.5px] uppercase text-slate mt-1">
          Official Round-By-Round Scorecard
        </div>
      </div>

      <div className="flex flex-col items-center lg:items-end gap-2">
        <div className="flex border-2 border-ink rounded overflow-hidden">
          <NavTab to="/">Events</NavTab>
          <NavTab to="/scorecards">Scorecards</NavTab>
        </div>

        {isOrganizer && (
          <NavLink
            to="/manage"
            className={`font-mono text-[10.5px] tracking-wide uppercase underline ${
              onManageFlow ? "text-corner-red" : "text-slate-light"
            }`}
          >
            Manage Events →
          </NavLink>
        )}

        {user ? (
          <div className="relative group">
            <button className="font-mono text-[10px] tracking-wide uppercase text-slate-light underline py-1">
              {user.name} ▾
            </button>
            {/* Bridges the gap between button and menu so the hover state
                doesn't drop when the mouse crosses it. */}
            <div className="absolute right-0 top-full h-2 w-full" />
            <div className="absolute right-0 top-full pt-2 hidden group-hover:block z-10">
              <div className="bg-canvas-light border-2 border-ink rounded shadow-[0_4px_12px_rgba(26,23,20,0.15)] overflow-hidden min-w-[140px]">
                <NavLink
                  to="/profile"
                  className="block px-4 py-2.5 font-mono text-[11px] tracking-wide uppercase text-ink hover:bg-canvas text-left"
                >
                  Profile
                </NavLink>
                <button
                  onClick={logout}
                  className="block w-full px-4 py-2.5 font-mono text-[11px] tracking-wide uppercase text-corner-red hover:bg-canvas text-left border-t border-line"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        ) : (
          <NavLink to="/login" className="font-mono text-[10px] tracking-wide uppercase text-slate-light underline">
            Sign in
          </NavLink>
        )}
      </div>
    </div>
  );
}
