import { useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useAppData } from "../context/AppDataContext.jsx";
import { WEIGHT_CLASSES, ALL_ORGS } from "../data/mockData.js";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import SectionLabel from "../components/SectionLabel.jsx";
import FormField, { formInputClasses } from "../components/FormField.jsx";
import FilterToggleChip from "../components/FilterToggleChip.jsx";

export default function AddUndercardFightPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { events, eventsLoading, addUndercardFight } = useAppData();

  const [fighterAName, setFighterAName] = useState("");
  const [fighterBName, setFighterBName] = useState("");
  const [weightClass, setWeightClass] = useState("");
  const [scheduledRounds, setScheduledRounds] = useState(10);
  const [titles, setTitles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (eventsLoading) {
    return <div className="text-center py-16 font-mono text-sm text-slate-light">Loading…</div>;
  }

  const event = events.find((e) => e.id === eventId);
  if (!event) return <Navigate to="/manage" replace />;

  function toggleTitle(org) {
    setTitles((prev) => (prev.includes(org) ? prev.filter((o) => o !== org) : [...prev, org]));
  }

  const canSubmit = fighterAName.trim() && fighterBName.trim() && weightClass && !submitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      await addUndercardFight(event, {
        fighterAName: fighterAName.trim(),
        fighterBName: fighterBName.trim(),
        weightClass,
        scheduledRounds: Number(scheduledRounds),
        titles,
      });
      navigate("/manage");
    } catch (err) {
      setError(err.message || "Failed to add fight");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Manage Events", to: "/manage" }, { label: event.name, to: "/manage" }, { label: "Add Undercard Fight" }]}
      />
      <SectionLabel>Add Undercard Fight</SectionLabel>

      <div className="bg-canvas-light border-2 border-ink rounded shadow-[0_1px_2px_rgba(26,23,20,0.06),0_8px_24px_rgba(26,23,20,0.08)] p-6">
        <div className="font-mono text-[10px] tracking-[2px] uppercase text-slate-light mb-3.5 pb-2.5 border-b border-line">
          {event.name} · {event.date}
        </div>

        <div className="flex gap-3.5 flex-wrap">
          <div className="flex-1 min-w-[220px]">
            <FormField label="Fighter — Red Corner">
              <input
                type="text"
                placeholder="Fighter A name"
                value={fighterAName}
                onChange={(e) => setFighterAName(e.target.value)}
                className={formInputClasses}
              />
            </FormField>
          </div>
          <div className="flex-1 min-w-[220px]">
            <FormField label="Fighter — Blue Corner">
              <input
                type="text"
                placeholder="Fighter B name"
                value={fighterBName}
                onChange={(e) => setFighterBName(e.target.value)}
                className={formInputClasses}
              />
            </FormField>
          </div>
        </div>

        <div className="flex gap-3.5 flex-wrap">
          <div className="flex-1 min-w-[220px]">
            <FormField label="Weight Class">
              <select value={weightClass} onChange={(e) => setWeightClass(e.target.value)} className={formInputClasses}>
                <option value="">Select weight class…</option>
                {WEIGHT_CLASSES.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
          <div className="w-[160px]">
            <FormField label="Scheduled Rounds">
              <select value={scheduledRounds} onChange={(e) => setScheduledRounds(e.target.value)} className={formInputClasses}>
                {[4, 6, 8, 10, 12].map((n) => (
                  <option key={n} value={n}>
                    {n} Rounds
                  </option>
                ))}
              </select>
            </FormField>
          </div>
        </div>

        <FormField label="Titles On The Line">
          <div className="flex gap-2 flex-wrap">
            {ALL_ORGS.map((org) => (
              <FilterToggleChip key={org} active={titles.includes(org)} onClick={() => toggleTitle(org)}>
                {org === "RING" ? "The Ring" : org}
              </FilterToggleChip>
            ))}
            {titles.length === 0 && (
              <span className="font-mono text-[11px] text-slate-light self-center">None selected — non-title bout</span>
            )}
          </div>
        </FormField>

        {error && <div className="font-mono text-[11px] text-corner-red mb-3">{error}</div>}

        <div className="flex gap-2.5 mt-5.5">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`font-display font-semibold uppercase text-[13px] px-5 py-3 rounded border-2 border-ink ${
              canSubmit ? "bg-ink text-canvas-light" : "opacity-40 cursor-not-allowed"
            }`}
          >
            {submitting ? "Adding…" : "Add Fight"}
          </button>
          <button
            onClick={() => navigate("/manage")}
            className="font-display font-semibold uppercase text-[13px] px-5 py-3 rounded border-2 border-line-strong text-slate"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
