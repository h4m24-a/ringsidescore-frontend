import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppData } from "../context/AppDataContext.jsx";
import { useAuth } from "../authContext/AuthContext.jsx";
import { fightsForEvent, mainEventOf, ALL_ORGS } from "../data/mockData.js";
import SectionLabel from "../components/SectionLabel.jsx";
import Pill from "../components/Pill.jsx";
import FilterToggleChip from "../components/FilterToggleChip.jsx";

const EVENTS_PER_PAGE = 6;

export default function EventsPage() {
  const { events, eventsLoading, eventsError, liveScorecards, scoredFightIds } = useAppData();
  const { isOrganizer } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [weightClass, setWeightClass] = useState("All");
  const [orgFilter, setOrgFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const allFights = events.flatMap((e) => e.fights);
  const weightClasses = ["All", ...new Set(allFights.map((f) => f.weightClass))];

  // Any change to search/filters invalidates the current page — e.g. being
  // on page 3 and then filtering down to 2 results would otherwise show a
  // blank page with no way back except manually clicking "Previous".
  function updateSearch(value) {
    setSearch(value);
    setCurrentPage(1);
  }
  function updateWeightClass(value) {
    setWeightClass(value);
    setCurrentPage(1);
  }
  function toggleOrg(org) {
    setOrgFilter((prev) => (prev.includes(org) ? prev.filter((o) => o !== org) : [...prev, org]));
    setCurrentPage(1);
  }
  function clearFilters() {
    setSearch("");
    setWeightClass("All");
    setOrgFilter([]);
    setCurrentPage(1);
  }

  function eventMatches(event) {
    const cardFights = fightsForEvent(event);
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      event.name.toLowerCase().includes(q) ||
      event.venue.toLowerCase().includes(q) ||
      cardFights.some((f) => f.fighterA.name.toLowerCase().includes(q) || f.fighterB.name.toLowerCase().includes(q));
    const matchesWeight = weightClass === "All" || cardFights.some((f) => f.weightClass === weightClass);
    const matchesOrg = orgFilter.length === 0 || cardFights.some((f) => orgFilter.every((o) => f.titles.includes(o)));
    return matchesSearch && matchesWeight && matchesOrg;
  }

  const filtered = events.filter(eventMatches);
  const hasActiveFilters = search || weightClass !== "All" || orgFilter.length > 0;
  const inputClasses = "font-mono text-[12.5px] px-3 py-2.5 border-2 border-line-strong rounded bg-canvas-light text-ink outline-none";

  // ---- pagination ----
  const totalPages = Math.max(1, Math.ceil(filtered.length / EVENTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages); // guards against a stale page number after data reloads
  const pageStart = (safePage - 1) * EVENTS_PER_PAGE;
  const paginatedEvents = filtered.slice(pageStart, pageStart + EVENTS_PER_PAGE);

  function goToPage(page) {
    const clamped = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(clamped);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (eventsLoading) {
    return <div className="text-center py-16 font-mono text-sm text-slate-light">Loading events…</div>;
  }

  if (eventsError) {
    return (
      <div className="text-center py-16 font-mono text-sm text-corner-red">
        Couldn't load events: {eventsError}
        <div className="text-slate-light mt-2 text-xs">Is the backend running at your VITE_API_URL?</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3.5">
        <SectionLabel>Upcoming Events</SectionLabel>
        {isOrganizer && (
          <button
            onClick={() => navigate("/events/create")}
            className="font-display font-semibold uppercase text-[12.5px] px-4 py-2.5 rounded border-2 border-ink bg-ink text-canvas-light whitespace-nowrap flex-shrink-0"
          >
            + Create Event
          </button>
        )}
      </div>

      <div className="flex gap-2.5 flex-wrap mb-3.5">
        <input
          type="text"
          placeholder="Search fighter, event, or venue…"
          value={search}
          onChange={(e) => updateSearch(e.target.value)}
          className={`${inputClasses} flex-1 min-w-[180px]`}
        />
        <select value={weightClass} onChange={(e) => updateWeightClass(e.target.value)} className={inputClasses}>
          {weightClasses.map((w) => (
            <option key={w} value={w}>
              {w === "All" ? "All Weight Classes" : w}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 flex-wrap mb-4.5 items-center">
        <span className="font-mono text-[10px] tracking-wide uppercase text-slate-light">Title:</span>
        {ALL_ORGS.map((org) => (
          <FilterToggleChip key={org} active={orgFilter.includes(org)} onClick={() => toggleOrg(org)}>
            {org}
          </FilterToggleChip>
        ))}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="font-mono text-[10.5px] tracking-wide uppercase text-corner-red underline ml-1"
          >
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-light font-mono text-[13px]">
          {events.length === 0 ? "No events scheduled. Check the Scorecards tab for completed bouts." : "No events match your filters."}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="font-mono text-[10.5px] text-black mb-5">
          Showing {pageStart + 1}–{Math.min(pageStart + EVENTS_PER_PAGE, filtered.length)} of {filtered.length} event
          {filtered.length === 1 ? "" : "s"}
        </div>
      )}

      {paginatedEvents.map((event) => {
        const main = mainEventOf(event);
        const cardFights = fightsForEvent(event);
        const anyInProgress = cardFights.some((f) => !!liveScorecards[f.id]); // .some() returns true if at least one element in the array satisfies the condition.
        const allScored = cardFights.length > 0 && cardFights.every((f) => scoredFightIds.has(f.id)); // .every returns false if an element does not satisfy the condition. returns true if all elements satsify condition

        return (
          <div
            key={event.id}
            className="flex overflow-hidden mb-4 rounded border-2 border-ink bg-white shadow-[0_1px_2px_rgba(26,23,20,0.06),0_8px_24px_rgba(26,23,20,0.08)]"
          >
            <button onClick={() => navigate(`/events/${event.id}`)} className="flex-1 text-left px-5 py-4.5">
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <div className="font-mono text-[10px] font-bold tracking-widest uppercase text-slate-light">
                  Fight Card · {cardFights.length} Bout{cardFights.length === 1 ? "" : "s"}
                </div>
                <div className="font-mono text-xs text-slate whitespace-nowrap">{event.date}</div>
              </div>
              <div className="font-display font-bold text-lg uppercase tracking-wide text-corner-red mt-1">{event.name}</div>

              <div className="font-mono text-[9.5px] font-bold tracking-widest uppercase text-[#8a6d1f] mt-2.5">Main Event</div>
              <div className="font-display font-semibold text-xl uppercase tracking-wide mt-0.5">
                {main ? (
                  <>
                    {main.fighterA.name}
                    <span className="text-corner-red font-bold mx-2 text-[15px]">vs</span>
                    {main.fighterB.name}
                  </>
                ) : (
                  "Main event TBA"
                )}
              </div>

              <div className="flex gap-2 flex-wrap mt-2.5">
                <Pill>{event.venue}</Pill>
                {main &&
                  main.titles.map((t) => (
                    <Pill key={t} title org={t}>
                      {t === "RING" ? "The Ring" : `${t} Title`}
                    </Pill>
                  ))}
                {allScored && <Pill>Card Complete</Pill>}
                {!allScored && anyInProgress && (
                  <span className="font-mono text-[10.5px] tracking-wide uppercase px-2.5 py-1 rounded-full border border-corner-red text-corner-red">
                    Scoring In Progress
                  </span>
                )}
              </div>
            </button>
            <div
              className="w-[110px] flex items-center justify-center flex-shrink-0 border-l-2 border-dashed border-canvas-light/50"
              style={{ backgroundImage: "repeating-linear-gradient(135deg, #1A1714, #1A1714 6px, #6B1A25 6px, #6B1A25 12px)" }}
            >
              <div className="font-display font-bold text-canvas-light [writing-mode:vertical-rl] tracking-widest text-xs uppercase">
                View Full Card
              </div>
            </div>
          </div>
        );
      })}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 1}
            className="font-mono text-xs uppercase tracking-wide px-3 py-2 rounded border-2 border-ink disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`font-mono text-xs w-8 h-8 rounded border-2 border-ink ${
                  page === safePage ? "bg-ink text-canvas-light" : "bg-canvas-light text-ink"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage === totalPages}
            className="font-mono text-xs uppercase tracking-wide px-3 py-2 rounded border-2 border-ink disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}