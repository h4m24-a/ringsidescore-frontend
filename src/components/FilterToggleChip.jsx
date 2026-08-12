export default function FilterToggleChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`font-mono text-[10.5px] tracking-wide uppercase px-3 py-1.5 rounded-full border-[1.5px] transition-colors ${
        active ? "bg-ink border-ink text-canvas-light font-bold" : "border-line-strong text-slate"
      }`}
    >
      {children}
    </button>
  );
}
