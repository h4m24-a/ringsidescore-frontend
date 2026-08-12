import RingBadge from "./RingBadge.jsx";
import { ORG_BADGE_CLASSES } from "./titleBadges.js";

export default function Pill({ children, title, org, size = "md" }) {
  if (org === "RING") {
    return <RingBadge size={size}>{children}</RingBadge>;
  }

  if (org && ORG_BADGE_CLASSES[org]) {
    const sizeClasses = size === "sm" ? "text-[10px] px-2.5 py-0.5" : "text-[10.5px] px-2.5 py-1";
    return (
      <span
        className={`font-mono font-bold uppercase tracking-wide rounded-full border shadow-sm ${sizeClasses} ${ORG_BADGE_CLASSES[org]}`}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={`font-mono uppercase tracking-wide rounded-full border px-2.5 py-1 text-[10.5px] ${
        title ? "bg-gold border-gold text-ink font-bold" : "border-line-strong text-slate"
      }`}
    >
      {children}
    </span>
  );
}
