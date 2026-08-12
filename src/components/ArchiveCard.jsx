import { useState } from "react";
import MiniScoreBox from "./MiniScoreBox.jsx";
import ScoreChip from "./ScoreChip.jsx";
import ShareScorecardButton from "./ShareScorecardButton.jsx";

export default function ArchiveCard({ fight, card }) {
  const [expanded, setExpanded] = useState(false);
  const { result } = card;
  const isStoppage = result.type === "stoppage";
  const isNC = isStoppage && result.code === "NC";

  const badgeClasses = isStoppage ? (isNC ? "bg-slate-light text-ink" : "bg-corner-red text-canvas-light") : "bg-slate text-canvas-light";
  const badgeText = isStoppage ? result.code : "Decision";

  const lastNameA = fight.fighterA.name.split(" ").slice(-1)[0];
  const lastNameB = fight.fighterB.name.split(" ").slice(-1)[0];

  return (
    <div className="bg-canvas-light border-2 border-ink rounded shadow-[0_1px_2px_rgba(26,23,20,0.06),0_8px_24px_rgba(26,23,20,0.08)] mb-4.5 overflow-hidden">
      <div className="px-5 py-4 bg-ink text-canvas-light flex justify-between items-start gap-3 flex-wrap">
        <div>
          <div className="font-display font-bold text-[19px] uppercase">
            {fight.fighterA.name} vs {fight.fighterB.name}
          </div>
          <div className="font-mono text-[10.5px] text-gold-light mt-1 uppercase tracking-wide">
            {fight.weightClass}
            {fight.titles.length > 0 ? ` · ${fight.titles.join("/")} Title` : " · Non-Title"}
          </div>
        </div>
        <span className={`font-mono font-bold text-[11px] tracking-wide px-3 py-1.5 rounded-full whitespace-nowrap uppercase ${badgeClasses}`}>
          {badgeText}
        </span>
      </div>

      <div className="px-5 py-4.5">
        <div className="font-display font-semibold text-[15px] mb-3">
          {isNC && "Result: No Contest — no winner declared."}
          {isStoppage && !isNC && (
            <span>
              Winner: <span className="text-corner-red">{result.winner}</span> — {result.label} in Round {result.roundStopped}
            </span>
          )}
          {!isStoppage && result.winner === "draw" && "Result: Draw"}
          {!isStoppage && result.winner !== "draw" && (
            <span>
              Winner: <span className="text-corner-red">{result.winner}</span> — Unanimous Decision
            </span>
          )}
        </div>

        <div className="flex gap-3.5 flex-wrap items-center">
          <MiniScoreBox label={`${lastNameA} Total`} value={result.finalTotals.a} />
          <MiniScoreBox label={`${lastNameB} Total`} value={result.finalTotals.b} />
          <MiniScoreBox label="Rounds Scored" value={`${card.rounds.filter((r) => r.a != null).length} / ${card.rounds.length}`} />
          <div className="ml-auto flex gap-2">
            <ShareScorecardButton fight={fight} card={card} />
            <button
              onClick={() => setExpanded((v) => !v)}
              className={`font-mono text-[11px] tracking-wide uppercase px-3.5 py-2 rounded border-2 border-ink ${
                expanded ? "bg-ink text-canvas-light" : ""
              }`}
            >
              {expanded ? "Hide Scorecard ▲" : "View Full Scorecard ▼"}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4.5 pt-4 border-t border-line overflow-x-auto">
            <table className="w-full border-collapse min-w-[420px]">
              <thead>
                <tr>
                  <th className="text-left font-mono text-[10px] tracking-wide uppercase text-slate pb-1.5 border-b-2 border-ink">Round</th>
                  <th className="font-mono text-[10px] tracking-wide uppercase text-slate pb-1.5 border-b-2 border-ink">{lastNameA}</th>
                  <th className="font-mono text-[10px] tracking-wide uppercase text-slate pb-1.5 border-b-2 border-ink">Card</th>
                  <th className="font-mono text-[10px] tracking-wide uppercase text-slate pb-1.5 border-b-2 border-ink">{lastNameB}</th>
                </tr>
              </thead>
              <tbody>
                {card.rounds.map((r) => {
                  const wasStoppedBefore = isStoppage && r.round > result.roundStopped;
                  return (
                    <tr key={r.round}>
                      <td className="text-left font-display font-semibold text-sm py-2 border-b border-line">
                        R{r.round}
                        {r.round === result.roundStopped && isStoppage && (
                          <span className="inline-block ml-1.5 font-mono text-[8.5px] text-canvas-light bg-corner-red px-1.5 rounded uppercase align-middle">
                            Stopped
                          </span>
                        )}
                      </td>
                      {wasStoppedBefore ? (
                        <>
                          <td className="text-center font-mono text-[11px] text-slate-light py-2 border-b border-line">—</td>
                          <td className="text-center font-mono text-[10px] text-slate-light py-2 border-b border-line">not reached</td>
                          <td className="text-center font-mono text-[11px] text-slate-light py-2 border-b border-line">—</td>
                        </>
                      ) : (
                        <>
                          <td className="text-center py-2 border-b border-line">
                            <ScoreChip value={r.a} corner="blue" highlight={r.a != null && r.b != null && !r.even && r.a > r.b} knockdown={r.knockdownA} />
                          </td>
                          <td className="text-center font-mono text-xs text-slate py-2 border-b border-line">
                            {r.a == null ? "—" : r.even ? "Even" : `${r.a}-${r.b}`}
                          </td>
                          <td className="text-center py-2 border-b border-line">
                            <ScoreChip value={r.b} corner="red" highlight={r.a != null && r.b != null && !r.even && r.b > r.a} knockdown={r.knockdownB} />
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
                <tr>
                  <td className="text-left font-display font-bold text-lg pt-3.5 border-t-[3px] border-ink">Total</td>
                  <td className="text-center font-display font-bold text-lg pt-3.5 border-t-[3px] border-ink">{result.finalTotals.a}</td>
                  <td className="pt-3.5 border-t-[3px] border-ink" />
                  <td className="text-center font-display font-bold text-lg pt-3.5 border-t-[3px] border-ink">{result.finalTotals.b}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
