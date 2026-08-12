import { api } from "./api.js";

export const eventsService = {
  list: () => api.get("/events"),
  get: (eventId) => api.get(`/events/${eventId}`),

  // organizer-only routes — the backend should reject these for role !== 'organizer'
  create: (payload) => api.post("/events", payload),
  addUndercardFight: (eventId, payload) => api.post(`/events/${eventId}/fights`, payload),
};

export const fightsService = {
  get: (fightId) => api.get(`/fights/${fightId}`),
};
