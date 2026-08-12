import { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useAppData } from "../context/AppDataContext.jsx";
import { totals } from "../data/mockData.js";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import Pill from "../components/Pill.jsx";
import ScorePick from "../components/ScorePick.jsx";
import KnockdownToggle from "../components/KnockdownToggle.jsx";
import StoppageModal from "../components/StoppageModal.jsx";

export default function ScoringPage() {
  const { eventId, fightId } = useParams();
  const navigate = useNavigate();
  const { events, eventsLoading, liveScorecards, getOrInitCard, updateCard, finalizeFight } = useAppData();
  const [showStopModal, setShowStopModal] = useState(false);
  const [cardError, setCardError] = useState(null);
  const [finalizing, setFinalizing] = useState(false);
  const [finalizeError, setFinalizeError] = useState(null);

  const event = events.find((e) => e.id === eventId);
  const fight = event?.fights.find((f) => f.id === fightId);

  // Fetch (or lazily create, server-side) this fight's scorecard once we
  // know which fight we're scoring. getOrInitCard is async — it hits
  // POST /scorecards — so this can't happen inline during render.
  useEffect(() => {
    if (!fight) return;
    if (liveScorecards[fight.id]) return;
    setCardError(null);
    getOrInitCard(fight).catch((err) => setCardError(err.message));
  }, [fight, liveScorecards, getOrInitCard]);

  if (eventsLoading) {
    return <div className="text-center py-16 font-mono text-sm text-slate-light">Loading…</div>;
  }
  if (!fight) return <Navigate to="/" replace />;

  const card = liveScorecards[fight.id];

  if (cardError) {
    return (
      <div className="text-center py-16 font-mono text-sm text-corner-red">
        Couldn't load this scorecard: {cardError}
        <div className="text-slate-light mt-2 text-xs">You may need to sign in to score a fight.</div>
      </div>
    );
  }
  if (!card) {
    return <div className="text-center py-16 font-mono text-sm text-slate-light">Loading scorecard…</div>;
  }

  const { rounds } = card;
  const scoredCount = rounds.filter((r) => r.a != null).length;
  const allScored = scoredCount === rounds.length;
  const t = totals(rounds);
  const lastNameA = fight.fighterA.name.split(" ").slice(-1)[0];
  const lastNameB = fight.fighterB.name.split(" ").slice(-1)[0];  // split() splits a string into an array of substrings, slice() creates a new string or array containing a portion of the original. slice(-1) returns an array containing the last element when used on an array. [0] accesses first item in array
  function setScore(roundIdx, corner, value) {
    updateCard(fight.id, (prev) => {
      const newRounds = prev.rounds.map((r, i) => {
        if (i !== roundIdx) return r;
        const updated = { ...r, even: false };
        if (corner === "a") updated.a = value;
        else updated.b = value;
        return updated;
      });
      return { ...prev, rounds: newRounds };
    });
  }

  function setEven(roundIdx) {
    updateCard(fight.id, (prev) => {
      const newRounds = prev.rounds.map((r, i) => (i === roundIdx ? { ...r, a: 10, b: 10, even: true } : r));
      return { ...prev, rounds: newRounds };
    });
  }

  function toggleKnockdown(roundIdx, corner) {
    updateCard(fight.id, (prev) => {
      const newRounds = prev.rounds.map((r, i) => {
        if (i !== roundIdx) return r;
        const key = corner === "a" ? "knockdownA" : "knockdownB";
        return { ...r, [key]: !r[key] };
      });
      return { ...prev, rounds: newRounds };
    });
  }

  async function handleStoppage(payload) {
    const RESULT_LABELS = { KO: "Knockout", TKO: "Technical KO", DQ: "Disqualification", NC: "No Contest" };
    setFinalizeError(null);
    setFinalizing(true);
    try {
      await finalizeFight(fight, {
        type: "stoppage",
        code: payload.code,
        label: RESULT_LABELS[payload.code],
        winner: payload.winner,
        roundStopped: payload.roundStopped,
        finalTotals: totals(rounds),
      });
      navigate("/scorecards");
    } catch (err) {
      setFinalizeError(err.message || "Failed to finalize scorecard");
    } finally {
      setFinalizing(false);
    }
  }

  async function handleDecision() {
    const winner = t.a === t.b ? "draw" : t.a > t.b ? fight.fighterA.name : fight.fighterB.name;
    setFinalizeError(null);
    setFinalizing(true);
    try {
      await finalizeFight(fight, { type: "decision", winner, finalTotals: t });
      navigate("/scorecards");
    } catch (err) {
      setFinalizeError(err.message || "Failed to finalize scorecard");
    } finally {
      setFinalizing(false);
    }
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Events", to: "/" },
          ...(event ? [{ label: event.name, to: `/events/${event.id}` }] : []),
          { label: `${lastNameA} vs ${lastNameB}` },
        ]}
      />

      <div className="bg-ink text-canvas-light rounded-t px-6 pt-5 pb-5">
        <div className="flex justify-between items-start gap-3 flex-wrap">
          <div>
            <div className="font-mono text-[11px] tracking-[2px] uppercase text-gold-light">{fight.weightClass}</div>
            <div className="flex gap-1.5 flex-wrap mt-1.5">
              {fight.titles.map((t2) => (
                <Pill key={t2} title org={t2} size="sm">
                  {t2 === "RING" ? "The Ring" : `${t2} Title`}
                </Pill>
              ))}
              {fight.titles.length === 0 && <Pill size="sm">Non-Title Bout</Pill>}
            </div>
          </div>
          <div className="font-display text-[13px] text-canvas-light/75 text-right uppercase tracking-wide">
            Scheduled
            <br />
            {fight.scheduledRounds} Rounds
          </div>
        </div>

        <div className="flex items-center mt-4.5">
          <div className="flex-1 text-left">
            <div className="font-mono text-[9.5px] tracking-[2px] uppercase opacity-55 mb-1">Red Corner</div>
            <div className="font-display font-bold text-2xl uppercase leading-tight">{fight.fighterA.name}</div>
            <div className="font-mono text-[11px] text-gold-light mt-1">{fight.fighterA.record}</div>
          </div>
          <div className="font-display font-bold text-[15px] text-corner-red px-4 flex-shrink-0">VS</div>
          <div className="flex-1 text-right">
            <div className="font-mono text-[9.5px] tracking-[2px] uppercase opacity-55 mb-1">Blue Corner</div>
            <div className="font-display font-bold text-2xl uppercase leading-tight">{fight.fighterB.name}</div>
            <div className="font-mono text-[11px] text-gold-light mt-1">{fight.fighterB.record}</div>
          </div>
        </div>
      </div>

      <div className="bg-canvas-light border-2 border-t-0 border-ink rounded-b p-6 shadow-[0_1px_2px_rgba(26,23,20,0.06),0_8px_24px_rgba(26,23,20,0.08)]">
        <div className="flex items-center justify-between gap-3 bg-corner-red text-canvas-light px-4.5 py-3 rounded mb-5">
          <div>
            <div className="font-display font-semibold uppercase tracking-wide text-sm">
              Round {scoredCount} of {rounds.length} scored
            </div>
            <div className="font-mono text-[11px] opacity-85 mt-0.5">10-Point Must System — tap a score to lock in the round</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse mb-2 min-w-[420px]">
            <thead>
              <tr>
                <th className="text-left font-mono text-[10px] tracking-wide uppercase text-slate pb-1.5 border-b-2 border-ink">Round</th>
                <th className="font-mono text-[10px] tracking-wide uppercase text-slate pb-1.5 border-b-2 border-ink">{lastNameA}</th>
                <th className="font-mono text-[10px] tracking-wide uppercase text-slate pb-1.5 border-b-2 border-ink">Even</th>
                <th className="font-mono text-[10px] tracking-wide uppercase text-slate pb-1.5 border-b-2 border-ink">{lastNameB}</th>
              </tr>
            </thead>
            <tbody>
              {rounds.map((r, idx) => (
                <tr key={r.round}>
                  <td className="text-left font-display font-semibold text-[15px] py-2 border-b border-line align-middle">
                    R{r.round}
                    <span className="block font-mono text-[9px] text-slate-light font-normal tracking-wide mt-0.5">
                      {r.a != null ? (r.even ? "even" : `${r.a}-${r.b}`) : "unscored"}
                    </span>
                  </td>
                  <td className="text-center py-2 border-b border-line align-middle">
                    <ScorePick selected={!r.even ? r.a : null} corner="blue" onPick={(v) => setScore(idx, "a", v)} />
                    <KnockdownToggle active={r.knockdownA} onClick={() => toggleKnockdown(idx, "a")} />
                  </td>
                  <td className="text-center py-2 border-b border-line align-middle">
                    <button
                      onClick={() => setEven(idx)}
                      title="Score round even (10-10)"
                      className={`w-[34px] h-[34px] rounded-full font-mono text-[10px] font-bold ${
                        r.even ? "bg-ink border-2 border-ink text-canvas-light" : "border-2 border-dashed border-line-strong text-slate-light"
                      }`}
                    >
                      10-10
                    </button>
                  </td>
                  <td className="text-center py-2 border-b border-line align-middle">
                    <ScorePick selected={!r.even ? r.b : null} corner="red" onPick={(v) => setScore(idx, "b", v)} />
                    <KnockdownToggle active={r.knockdownB} onClick={() => toggleKnockdown(idx, "b")} />
                  </td>
                </tr>
              ))}
              <tr>
                <td className="text-left font-display font-bold text-xl pt-3.5 border-t-[3px] border-ink">Total</td>
                <td className="text-center font-display font-bold text-xl pt-3.5 border-t-[3px] border-ink">{t.a}</td>
                <td className="pt-3.5 border-t-[3px] border-ink" />
                <td className="text-center font-display font-bold text-xl pt-3.5 border-t-[3px] border-ink">{t.b}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="font-mono text-[10px] text-slate-light text-center mb-3">
          Knockdown marks the fighter who <strong>scored</strong> the knockdown — landed it, didn't take it. It's a reminder only; drop a
          point from the opponent's round score yourself.
        </div>

        {finalizeError && <div className="font-mono text-[11px] text-corner-red text-center mb-3">{finalizeError}</div>}

        <div className="flex gap-2.5 flex-wrap">
          <button
            disabled={!allScored || finalizing}
            onClick={handleDecision}
            className={`font-display font-semibold uppercase text-[13px] px-5 py-3 rounded border-2 border-ink ${
              allScored && !finalizing ? "bg-ink text-canvas-light" : "opacity-40 cursor-not-allowed"
            }`}
          >
            {finalizing ? "Submitting…" : allScored ? "Submit Final Decision" : `Score all ${rounds.length} rounds to submit`}
          </button>
          <button
            disabled={finalizing}
            onClick={() => setShowStopModal(true)}
            className="font-display font-semibold uppercase text-[13px] px-5 py-3 rounded border-2 border-corner-red text-corner-red disabled:opacity-40"
          >
            End Fight Early (KO / TKO / DQ / NC)
          </button>
        </div>
      </div>

      {showStopModal && (
        <StoppageModal
          fight={fight}
          maxRounds={rounds.length}
          onCancel={() => setShowStopModal(false)}
          onConfirm={(payload) => {
            setShowStopModal(false);
            handleStoppage(payload);
          }}
        />
      )}
    </div>
  );
}
