export default function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2.5 mb-3.5 ml-0.5 font-mono text-[11px] tracking-[2px] uppercase text-slate">
      {children}
      <span className="flex-1 h-px bg-line-strong" />
    </div>
  );
}
