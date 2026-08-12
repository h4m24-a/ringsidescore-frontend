// items: [{ label, to? }] — the last item (no `to`) is the current page.
// Earlier items are Links back up the hierarchy.
import { Link } from "react-router-dom";

export default function Breadcrumbs({ items }) {
  return (
    <div className="flex items-center flex-wrap gap-1.5 mb-4 font-mono text-[11.5px] tracking-wide uppercase">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-black">/</span>}  {/*  adds this / only after the first element (index 0) */} 
          {item.to ? (
            <Link to={item.to} className="text-red-600 underline hover:text-corner-red">
              {item.label}
            </Link>
          ) : (  
            <span className="text-ink font-bold">{item.label}</span> 
          )}
        </span>
      ))}
    </div>
  );
}



/* Line 17: Display the current tab with no link */