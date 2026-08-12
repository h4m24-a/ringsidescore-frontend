import { SCORE_OPTIONS } from "../data/mockData.js";

export default function ScorePick({ selected, corner, onPick }) {
  const activeClasses = corner === "blue" ? "bg-slate border-slate text-canvas-light" : "bg-corner-red border-corner-red text-canvas-light";

  return (
    <div className="flex gap-1.5 justify-center flex-wrap">
      {SCORE_OPTIONS.map((val) => {
        const isSelected = selected === val;
        return (
          <button
            key={val}
            onClick={() => onPick(val)}
            className={`w-[34px] h-[34px] rounded-full border-2 font-mono font-bold text-[13px] ${
              isSelected ? activeClasses : "border-line-strong bg-canvas-light text-slate"
            }`}
          >
            {val}
          </button>
        );
      })}
    </div>
  );
}
