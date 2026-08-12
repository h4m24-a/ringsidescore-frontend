export default function FormField({ label, children }) {
  return (
    <div className="mb-4">
      <label className="font-mono text-[10.5px] tracking-wide uppercase text-slate block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export const formInputClasses = "w-full font-mono text-[12.5px] px-3 py-2.5 border-2 border-line-strong rounded bg-canvas-light text-ink outline-none";
