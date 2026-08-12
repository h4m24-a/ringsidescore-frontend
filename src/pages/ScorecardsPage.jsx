import { useState } from "react";
import { useAppData } from "../context/AppDataContext.jsx";
import SectionLabel from "../components/SectionLabel.jsx";
import FilterToggleChip from "../components/FilterToggleChip.jsx";
import ArchiveCard from "../components/ArchiveCard.jsx";

const RESULT_FILTERS = ["All", "Decision", "KO", "TKO", "DQ", "NC"];
const inputClasses = "font-mono text-[12.5px] px-3 py-2.5 border-2 border-line-strong rounded bg-canvas-light text-ink outline-none";
const SCORECARDS_PER_PAGE = 5;

export default function ScorecardsPage() {
  const { archive, archiveLoading } = useAppData();
  const [search, setSearch] = useState("");
  const [weightClass, setWeightClass] = useState("All");
  const [resultFilter, setResultFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  if (archiveLoading) {
    return (
      <div>
        <SectionLabel>Past Scorecards</SectionLabel>
        <div className="text-center py-12 text-slate-light font-mono text-[13px]">Loading your scorecards…</div>
      </div>
    );
  }

  if (archive.length === 0) {
    return (
      <div>
        <SectionLabel>Past Scorecards</SectionLabel>
        <div className="text-center py-12 text-slate-light font-mono text-[13px]">
          No completed fights yet. Score a bout from the Events tab to see it here — or sign in if you haven't.
        </div>
      </div>
    );
  }

  const weightClasses = ["All", ...new Set(archive.map((a) => a.fight.weightClass))];

  function resultCode(entry) {
    return entry.result.type === "stoppage" ? entry.result.code : "Decision";
  }

  // Any change to search/filters invalidates the current page — otherwise
  // filtering down to a handful of results could leave you stuck on a page
  // with nothing on it.
  function updateSearch(value) {
    setSearch(value);
    setCurrentPage(1);
  }
  function updateWeightClass(value) {
    setWeightClass(value);
    setCurrentPage(1);
  }
  function updateResultFilter(value) {
    setResultFilter(value);
    setCurrentPage(1);
  }
  function clearFilters() {
    setSearch("");
    setWeightClass("All");
    setResultFilter("All");
    setCurrentPage(1);
  }

  const filtered = archive.filter((entry) => {
    const q = search.trim().toLowerCase();
    const { fight } = entry;
    const matchesSearch = !q || fight.fighterA.name.toLowerCase().includes(q) || fight.fighterB.name.toLowerCase().includes(q);
    const matchesWeight = weightClass === "All" || fight.weightClass === weightClass;
    const matchesResult = resultFilter === "All" || resultCode(entry) === resultFilter;
    return matchesSearch && matchesWeight && matchesResult;
  });

  const hasActiveFilters = search || weightClass !== "All" || resultFilter !== "All";

  // ---- pagination ----
  const totalPages = Math.max(1, Math.ceil(filtered.length / SCORECARDS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages); // guards against a stale page number after data reloads
  const pageStart = (safePage - 1) * SCORECARDS_PER_PAGE;
  const paginatedEntries = filtered.slice(pageStart, pageStart + SCORECARDS_PER_PAGE);

  function goToPage(page) {
    const clamped = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(clamped);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      <SectionLabel>Past Scorecards</SectionLabel>

      <div className="flex gap-2.5 flex-wrap mb-3.5">
        <input
          type="text"
          placeholder="Search fighter…"
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
        <span className="font-mono text-[10px] tracking-wide uppercase text-slate-light">Result:</span>
        {RESULT_FILTERS.map((rf) => (
          <FilterToggleChip key={rf} active={resultFilter === rf} onClick={() => updateResultFilter(rf)}>
            {rf}
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

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-light font-mono text-[13px]">No scorecards match your filters.</div>
      ) : (
        <>
          <div className="font-mono text-[10.5px] text-black mb-5">
            Showing {pageStart + 1}–{Math.min(pageStart + SCORECARDS_PER_PAGE, filtered.length)} of {filtered.length} scorecard
            {filtered.length === 1 ? "" : "s"}
          </div>

          {paginatedEntries.map((entry) => (
            <ArchiveCard key={entry.id} fight={entry.fight} card={entry} />
          ))}

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
        </>
      )}
    </div>
  );
}