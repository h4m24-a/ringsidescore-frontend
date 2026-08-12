export default function MiniScoreBox({ label, value }) {
  return (
    <div className="font-mono text-[11px] text-slate bg-canvas border border-line rounded px-3 py-2">
      {label}
      <b className="font-display text-[15px] text-ink block">{value}</b>
    </div>
  );
}
