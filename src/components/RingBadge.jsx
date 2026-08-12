export default function RingBadge({ size = "md", children }) {
  const isSm = size === "sm";
  return (
    <span className="inline-flex flex-col rounded-md overflow-hidden border border-gold align-middle">
      <span
        className={`bg-gold text-[#4A3400] font-mono font-bold uppercase tracking-wide text-center ${
          isSm ? "text-[10px] px-2.5 py-0.5" : "text-[10.5px] px-2.5 py-1"
        }`}
      >
        {children}
      </span>
      <span className={`flex ${isSm ? "h-[3px]" : "h-1.5"}`}>
        <span className="flex-1 bg-ring-red" />
        <span className="flex-1 bg-ring-white" />
        <span className="flex-1 bg-ring-blue" />
      </span>
    </span>
  );
}
