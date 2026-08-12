export default function KnockdownToggle({ active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`font-mono text-[9px] tracking-wide uppercase px-1.5 py-1 rounded mt-1 block w-full border ${
        active ? "bg-gold border-gold text-ink font-bold" : "border-line-strong text-slate-light"
      }`}
    >
      {active ? "Scored Knockdown ✓" : "Mark scored knockdown"}
    </button>
  );
}
