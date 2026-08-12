// Shared constants + data-shaping helpers.
//
// Seed data now lives in the backend (ringside-api/prisma/seed.js) — this
// file no longer holds mock EVENTS/FIGHTS arrays. What's left are: static
// lookup lists the UI needs, and normalizers that translate the backend's
// Prisma shapes into what the existing components already expect (so pages
// built against the old mock shape didn't need a rewrite).

export const WEIGHT_CLASSES = [
  "Heavyweight",
  "Cruiserweight",
  "Light Heavyweight",
  "Super Middleweight",
  "Middleweight",
  "Super Welterweight",
  "Welterweight",
  "Super Lightweight",
  "Lightweight",
  "Super Featherweight",
  "Featherweight",
  "Super Bantamweight",
  "Bantamweight",
  "Super Flyweight",
  "Flyweight",
];

export const ALL_ORGS = ["WBC", "WBA", "IBF", "WBO", "RING"];

export const RESULT_TYPES = [
  { code: "KO", label: "Knockout", desc: "Fighter unable to beat the count." },
  { code: "TKO", label: "Technical KO", desc: "Referee or corner stops the bout." },
  { code: "DQ", label: "Disqualification", desc: "Fighter disqualified for fouls." },
  { code: "NC", label: "No Contest", desc: "Result voided — no winner declared." },
];

export const SCORE_OPTIONS = [10, 9, 8, 7,6,5];

const STOPPAGE_LABELS = { KO: "Knockout", TKO: "Technical KO", DQ: "Disqualification", NC: "No Contest" };

export function formatDateDisplay(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ---- normalize backend (Prisma) shapes into what the UI expects ----

export function normalizeFighter(f) {
  if (!f) return null;
  return { id: f.id, name: f.name, record: `${f.wins ?? 0}-${f.losses ?? 0}-${f.draws ?? 0}` };
}

export function normalizeFight(f) {
  const hasOfficial = f.officialMethod || f.officialRoundWinners || f.officialWinnerId || f.officialResultIsDraw;
  return {
    id: f.id,
    eventId: f.eventId,
    isMainEvent: f.isMainEvent,
    fighterA: normalizeFighter(f.fighterA),
    fighterB: normalizeFighter(f.fighterB),
    weightClass: f.weightClass,
    scheduledRounds: f.scheduledRounds,
    titles: f.titles || [],
    official: hasOfficial
      ? {
          winner: f.officialResultIsDraw ? "draw" : f.officialWinner?.name ?? null,
          method: f.officialMethod,
          roundStopped: f.officialRoundStopped,
          roundWinners: f.officialRoundWinners,
        }
      : null,
  };
}

export function normalizeEvent(e) {
  return {
    id: e.id,
    name: e.name,
    venue: e.venue,
    date: formatDateDisplay(e.date),
    fights: (e.fights || []).map(normalizeFight),
  };
}

// Normalizes a backend Scorecard (nested fight/fighterA/fighterB/winnerFighter)
// into the { rounds, status, result } shape the scoring/archive UI expects.
export function normalizeScorecard(sc) {
  const fight = sc.fight ? normalizeFight(sc.fight) : null;
  let result = null;

  if (sc.status === "FINAL") {
    const winnerName = sc.isDraw ? "draw" : sc.winnerFighter?.name ?? null;
    result =
      sc.resultType === "stoppage"
        ? {
            type: "stoppage",
            code: sc.stoppageCode,
            label: STOPPAGE_LABELS[sc.stoppageCode],
            winner: winnerName,
            roundStopped: sc.roundStopped,
            finalTotals: { a: sc.totalA, b: sc.totalB },
          }
        : { type: "decision", winner: winnerName, finalTotals: { a: sc.totalA, b: sc.totalB } };
  }

  return {
    id: sc.id,
    fightId: sc.fightId ?? sc.fight?.id,
    status: sc.status === "FINAL" ? "final" : "live",
    rounds: sc.rounds,
    result,
    fight,
  };
}

// ---- fight/event lookups — now operate on one normalized event's nested fights ----

export function fightsForEvent(event) {
  return event.fights;
}
export function mainEventOf(event) {
  return event.fights.find((f) => f.isMainEvent) || null;
}
export function undercardOf(event) {
  return event.fights.filter((f) => !f.isMainEvent);
}

// ---- round-scoring helpers, still used client-side while live-scoring ----

export function emptyRounds(n) {
  return Array.from({ length: n }, (_, i) => ({
    round: i + 1,
    a: null,
    b: null,
    even: false,
    knockdownA: false,
    knockdownB: false,
  }));
}

export function totals(rounds) {
  let a = 0;
  let b = 0;
  rounds.forEach((r) => {
    if (r.a != null) a += r.a;
    if (r.b != null) b += r.b;
  });
  return { a, b };
}
