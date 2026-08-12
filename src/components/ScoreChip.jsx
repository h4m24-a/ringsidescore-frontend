export default function ScoreChip({ value, corner, highlight, knockdown }) {
  const activeClasses = corner === "blue" ? "bg-slate border-slate text-canvas-light" : "bg-corner-red border-corner-red text-canvas-light";
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className={`w-[30px] h-[30px] rounded-full border-2 font-mono font-bold text-xs flex items-center justify-center ${
          highlight ? activeClasses : "border-line-strong text-slate"
        }`}
      >
        {value == null ? "—" : value}
      </div>
      {knockdown && <span className="font-mono text-[8px] text-gold font-bold tracking-wide uppercase">Scored KD</span>}
    </div>
  );
}
