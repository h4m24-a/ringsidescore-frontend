import { api } from "./api.js";

export const scorecardsService = {
  // fetches (or lazily creates) the current user's in-progress scorecard for a fight
  getOrCreate: (fightId) => api.post("/scorecards", { fightId }),

  // saves round-by-round progress on a live scorecard
  updateRounds: (scorecardId, rounds) => api.patch(`/scorecards/${scorecardId}`, { rounds }),

  // locks in the final decision or stoppage result
  finalize: (scorecardId, result) => api.post(`/scorecards/${scorecardId}/finalize`, result),

  // all of the current user's completed scorecards, for the Scorecards tab
  mine: () => api.get("/scorecards/mine"),

  // aggregate accuracy vs. official results, if that feature is wired up
  myAccuracy: () => api.get("/users/me/accuracy"),
};
