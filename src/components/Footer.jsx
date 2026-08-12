import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-ink text-canvas-light">
      <div
        className="h-1.5"
        
      />

      <div className="max-w-[920px] mx-auto px-5 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-[1.3fr_1fr_1fr] gap-8">
          <div>
            <div className="font-display font-bold text-2xl tracking-wide uppercase leading-none">
              RING<span className="text-corner-red">SIDE</span>
            </div>
            <p className="font-mono text-[11px] text-canvas-light/60 mt-3 leading-relaxed max-w-[240px]">
              Score every round. Keep your card. Ringside is a personal scoring tool — not an
              official sanctioning body, judge, or broadcaster.
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-gold-light mb-3">Product</div>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="font-mono text-[12px] text-canvas-light/75 hover:text-canvas-light transition-colors w-fit">
                Events
              </Link>
              <Link to="/scorecards" className="font-mono text-[12px] text-canvas-light/75 hover:text-canvas-light transition-colors w-fit">
                Scorecards
              </Link>
              <Link to="/profile" className="font-mono text-[12px] text-canvas-light/75 hover:text-canvas-light transition-colors w-fit">
                Profile
              </Link>
            </nav>
          </div>

          <div>
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-gold-light mb-3">Legal</div>
            <nav className="flex flex-col gap-2">
              <Link to="/privacypolicy" className="font-mono text-[12px] text-canvas-light/75 hover:text-canvas-light transition-colors w-fit">
                Privacy Policy
              </Link>
              <Link to="/termsofservice" className="font-mono text-[12px] text-canvas-light/75 hover:text-canvas-light transition-colors w-fit">
                Terms of Service
              </Link>
             
            </nav>
          </div>
        </div>

        <div className="mt-9 pt-5 border-t border-canvas-light/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="font-mono text-[10.5px] text-canvas-light/45">
            © {year} Ringside — Fight Scorecards. All rights reserved.
          </div>
          <div className="font-mono text-[10px] tracking-wide uppercase text-canvas-light/35">
            Not affiliated with any boxing commission or sanctioning body
          </div>
        </div>
      </div>
    </footer>
  );
}