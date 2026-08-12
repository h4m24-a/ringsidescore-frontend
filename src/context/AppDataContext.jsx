import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { eventsService } from "../services/eventsService.js";
import { scorecardsService } from "../services/scorecardsService.js";
import { normalizeEvent, normalizeScorecard } from "../data/mockData.js";
import { useAuth } from "../authContext/AuthContext.jsx";

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState(null);

  const [liveScorecards, setLiveScorecards] = useState({}); // fightId -> normalized scorecard
  const [archive, setArchive] = useState([]); // normalized, status === 'final'
  const [archiveLoading, setArchiveLoading] = useState(false);

  // Dedupes concurrent getOrInitCard calls for the same fight (e.g. React
  // StrictMode's double-invoke, or a fast double-click) so we never fire two
  // POST /scorecards requests before the first one lands.
  const pendingCardRequests = useRef({});

  // ---- events: GET /events on mount ----
  const loadEvents = useCallback(async () => {
    setEventsLoading(true);
    setEventsError(null);
    try {
      const data = await eventsService.list();
      setEvents((data.events || []).map(normalizeEvent));
    } catch (err) {
      setEventsError(err.message);
    } finally {
      setEventsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // ---- personal scorecard history: only meaningful once signed in ----
  const loadArchive = useCallback(async () => {
    if (!user) {
      setArchive([]);
      return;
    }
    setArchiveLoading(true);
    try {
      const data = await scorecardsService.mine();
      setArchive((data.scorecards || []).map(normalizeScorecard));
    } catch (err) {
      console.error("Failed to load scorecards", err);
    } finally {
      setArchiveLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadArchive();
  }, [loadArchive]);

  const scoredFightIds = new Set(archive.map((sc) => sc.fightId));

  // ---- live scoring: POST /scorecards (get-or-create), PATCH to save rounds ----

  async function getOrInitCard(fight) {
    if (liveScorecards[fight.id]) return liveScorecards[fight.id];
    if (pendingCardRequests.current[fight.id]) return pendingCardRequests.current[fight.id];

    const promise = scorecardsService
      .getOrCreate(fight.id)
      .then((data) => {
        const card = normalizeScorecard(data.scorecard);
        setLiveScorecards((prev) => ({ ...prev, [fight.id]: card }));
        return card;
      })
      .finally(() => {
        delete pendingCardRequests.current[fight.id];
      });

    pendingCardRequests.current[fight.id] = promise;
    return promise;
  }

  // `updater` gets the current card and returns the next one — same call
  // shape ScoringPage already uses. Persists the new rounds to the backend
  // in the background; the UI updates optimistically from local state.
  function updateCard(fightId, updater) {
    setLiveScorecards((prev) => {
      const current = prev[fightId];
      if (!current) return prev;
      const next = updater(current);
      scorecardsService.updateRounds(current.id, next.rounds).catch((err) => {
        console.error("Failed to save round progress", err);
      });
      return { ...prev, [fightId]: next };
    });
  }

  async function finalizeFight(fight, resultPayload) {
    const card = liveScorecards[fight.id];
    if (!card) throw new Error("No scorecard to finalize");

    const data = await scorecardsService.finalize(card.id, {
      type: resultPayload.type,
      winner: resultPayload.winner,
      stoppageCode: resultPayload.code,
      roundStopped: resultPayload.roundStopped,
      totalA: resultPayload.finalTotals.a,
      totalB: resultPayload.finalTotals.b,
    });

    const finalized = normalizeScorecard(data.scorecard);
    setArchive((prev) => [finalized, ...prev]);
    setLiveScorecards((prev) => {
      const next = { ...prev };
      delete next[fight.id];
      return next;
    });
    return finalized;
  }

  // ---- organizer actions: POST /events, POST /events/:id/fights ----

  async function createEvent({ eventName, location, date, fighterAName, fighterBName, weightClass, scheduledRounds, titles }) {
    const data = await eventsService.create({
      name: eventName,
      venue: location,
      date, // expects an ISO date string (e.g. from <input type="date">)
      fighterAName,
      fighterBName,
      weightClass,
      scheduledRounds,
      titles,
    });
    const newEvent = normalizeEvent(data.event);
    setEvents((prev) => [newEvent, ...prev]);
    return newEvent;
  }

  async function addUndercardFight(event, { fighterAName, fighterBName, weightClass, scheduledRounds, titles }) {
    await eventsService.addUndercardFight(event.id, { fighterAName, fighterBName, weightClass, scheduledRounds, titles });
    // Refetch the one event so its `fights` list picks up the new bout —
    // simpler and less error-prone than hand-splicing the response in.
    const refreshed = await eventsService.get(event.id);
    const normalized = normalizeEvent(refreshed.event);
    setEvents((prev) => prev.map((e) => (e.id === event.id ? normalized : e)));
    return normalized;
  }

  const value = {
    events,
    eventsLoading,
    eventsError,
    reloadEvents: loadEvents,
    liveScorecards,
    archive,
    archiveLoading,
    scoredFightIds,
    getOrInitCard,
    updateCard,
    finalizeFight,
    createEvent,
    addUndercardFight,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within an AppDataProvider");
  return ctx;
}
