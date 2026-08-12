import { useNavigate } from "react-router-dom";
import { useAppData } from "../context/AppDataContext.jsx";
import { mainEventOf, undercardOf } from "../data/mockData.js";
import SectionLabel from "../components/SectionLabel.jsx";

export default function ManageEventsPage() {
  const { events, eventsLoading } = useAppData();
  const navigate = useNavigate();

  if (eventsLoading) {
    return <div className="text-center py-16 font-mono text-sm text-slate-light">Loading events…</div>;
  }

  return (
    <div>
      <SectionLabel>Manage Events</SectionLabel>
      <div className="font-mono text-[11.5px] text-slate mb-4.5 leading-relaxed">
        Pick an event to add an undercard bout to its fight card.
      </div>

      {events.length === 0 && (
        <div className="text-center py-12 text-slate-light font-mono text-[13px]">No events yet. Create one from the Events tab first.</div>
      )}

      {events.map((event) => {
        const main = mainEventOf(event);
        const undercardCount = undercardOf(event).length;
        return (
          <div
            key={event.id}
            className="bg-canvas-light border-2 border-ink rounded shadow-[0_1px_2px_rgba(26,23,20,0.06),0_8px_24px_rgba(26,23,20,0.08)] mb-3.5 px-5 py-4 flex items-center justify-between gap-3.5 flex-wrap"
          >
            <div>
              <div className="font-display font-bold text-[17px] uppercase">{event.name}</div>
              <div className="flex items-center flex-wrap gap-2 mt-2">
                <span className="font-mono text-[11px] font-bold text-corner-red">{event.date}</span>
                <span className="text-line-strong text-[11px]">·</span>
                <span className="font-mono text-[11px] text-slate">{event.venue}</span>
                {main && (
                  <>
                    <span className="text-line-strong text-[11px]">·</span>
                    <span className="font-mono text-[10px] font-bold tracking-wide uppercase text-[#8a6d1f]">Main</span>
                    <span className="font-display text-[13px] font-semibold text-ink">
                      {main.fighterA.name} <span className="text-corner-red">vs</span> {main.fighterB.name}
                    </span>
                  </>
                )}
                <span className="font-mono text-[10px] font-bold tracking-wide uppercase text-slate-light bg-canvas border border-line rounded-full px-2.5 py-0.5">
                  {undercardCount} Undercard {undercardCount === 1 ? "Bout" : "Bouts"}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate(`/manage/${event.id}/add-fight`)}
              className="font-display font-semibold uppercase text-xs px-4 py-2.5 rounded border-2 border-ink bg-ink text-canvas-light whitespace-nowrap flex-shrink-0"
            >
              + Add Undercard Fight
            </button>
          </div>
        );
      })}
    </div>
  );
}
