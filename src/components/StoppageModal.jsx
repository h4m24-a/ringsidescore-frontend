import { useState } from "react";
import { RESULT_TYPES } from "../data/mockData.js";

export default function StoppageModal({ fight, maxRounds, onCancel, onConfirm }) {
  const [code, setCode] = useState(null);
  const [winner, setWinner] = useState(null);
  const [roundStopped, setRoundStopped] = useState(1);

  const needsWinner = code && code !== "NC";
  const canConfirm = code && (!needsWinner || winner);

  return (
    <div className="fixed inset-0 bg-ink/55 flex items-center justify-center z-50 p-5" onClick={onCancel}>
      <div
        className="bg-canvas-light border-2 border-ink rounded-md p-6 max-w-[420px] w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display uppercase text-lg mb-1">End Fight Early</h3>
        <p className="font-mono text-[11.5px] text-slate mb-4">Record how the bout ended before the scheduled distance.</p>

        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {RESULT_TYPES.map((rt) => {
            const selected = code === rt.code;
            return (
              <button
                key={rt.code}
                onClick={() => {
                  setCode(rt.code);
                  if (rt.code === "NC") setWinner(null);
                }}
                className={`text-left rounded p-3 border-2 ${selected ? "border-ink bg-canvas" : "border-line-strong"}`}
              >
                <div className="font-display font-bold text-base">{rt.code}</div>
                <div className="font-mono text-[9.5px] text-slate-light mt-0.5 leading-snug">{rt.desc}</div>
              </button>
            );
          })}
        </div>

        {needsWinner && (
          <div className="mb-4">
            <label className="font-mono text-[10px] tracking-wide uppercase text-slate block mb-2">Winner</label>
            <div className="flex gap-2">
              {[fight.fighterA.name, fight.fighterB.name].map((name) => {
                const selected = winner === name;
                return (
                  <button
                    key={name}
                    onClick={() => setWinner(name)}
                    className={`flex-1 p-2.5 rounded border-2 font-display font-semibold uppercase text-[12.5px] ${
                      selected ? "border-ink bg-ink text-canvas-light" : "border-line-strong"
                    }`}
                  >
                    {name.split(" ").slice(-1)[0]}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="font-mono text-[10px] tracking-wide uppercase text-slate block mb-2">Round Ended</label>
          <select
            value={roundStopped}
            onChange={(e) => setRoundStopped(Number(e.target.value))}
            className="w-full p-2.5 font-mono text-[13px] border-2 border-line-strong rounded bg-canvas-light text-ink"
          >
            {Array.from({ length: maxRounds }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                Round {n}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2.5 justify-end">
          <button onClick={onCancel} className="font-display font-semibold uppercase text-[13px] px-5 py-3 rounded border-2 border-ink">
            Cancel
          </button>
          <button
            disabled={!canConfirm}
            onClick={() => onConfirm({ code, winner, roundStopped })}
            className={`font-display font-semibold uppercase text-[13px] px-5 py-3 rounded border-2 border-ink ${
              canConfirm ? "bg-ink text-canvas-light" : "opacity-40 cursor-not-allowed"
            }`}
          >
            Confirm Result
          </button>
        </div>
      </div>
    </div>
  );
}
