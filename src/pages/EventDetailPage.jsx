import { useParams, Navigate } from "react-router-dom";
import { useAppData } from "../context/AppDataContext.jsx";
import { mainEventOf, undercardOf } from "../data/mockData.js";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import SectionLabel from "../components/SectionLabel.jsx";
import FightTicket from "../components/FightTicket.jsx";

export default function EventDetailPage() {
  const { eventId } = useParams();
  const { events, eventsLoading, liveScorecards, scoredFightIds } = useAppData();

  if (eventsLoading) {
    return <div className="text-center py-16 font-mono text-sm text-slate-light">Loading fight card…</div>;
  }

  const event = events.find((e) => e.id === eventId);
  if (!event) return <Navigate to="/" replace />;

  const main = mainEventOf(event);
  const undercard = undercardOf(event);

  return (
    <div>
      <Breadcrumbs items={[{ label: "Events", to: "/" }, { label: event.name }]} />

      <div className="bg-ink text-canvas-light rounded px-5.5 py-4.5 mb-5.5">
        <div className="font-display font-bold text-[26px] uppercase tracking-wide">{event.name}</div>
        <div className="font-mono text-xs text-gold-light mt-1.5 tracking-wide">
          {event.date} · {event.venue}
        </div>
      </div>

      {main && (
        <div className="mb-6.5">
          <SectionLabel>Main Event</SectionLabel>
          <FightTicket
            fight={main}
            eventId={event.id}
            inProgress={!!liveScorecards[main.id]}
            alreadyScored={scoredFightIds.has(main.id)}
            featured
          />
        </div>
      )}

      {undercard.length > 0 && (
        <div>
          <SectionLabel>Undercard</SectionLabel>
          {undercard.map((f) => (
            <FightTicket
              key={f.id}
              fight={f}
              eventId={event.id}
              inProgress={!!liveScorecards[f.id]}
              alreadyScored={scoredFightIds.has(f.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
