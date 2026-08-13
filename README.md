# Ringside — Fight Scorecards

# View: https://ringsidescore.com/

A boxing scorecard app: browse fight cards, score bouts round-by-round on the
10-Point Must System, and keep a personal archive of finished scorecards.

## Stack

- **Vite + React** — build tooling and UI
- **React Router** — client-side routing
- **Tailwind CSS** — styling, with the app's championship-belt palette
  registered in `tailwind.config.js`
- **Context API** — `AuthContext` for the signed-in user, `AppDataContext`
  for events/fights/scorecards state

## Getting started

```bash
npm install
cp .env.example .env   # point VITE_API_URL at your backend once it exists
npm run dev
```

The app runs fully on mock data (`src/data/mockData.js`) without a backend —
you can browse events, score fights, and view the Scorecards tab immediately.
**Sign in / Sign up and the organizer-only pages (Create Event, Manage
Events) require a real backend** implementing the endpoints in
`src/services/*.js` — those calls will fail until that API exists.

## Project structure

```
src/
├── main.jsx                 # entry point — wraps the app in Router + providers
├── App.jsx                  # route definitions
├── index.css                # Tailwind directives + base styles
├── authContext/
│   └── AuthContext.jsx      # current user, login/register/logout
├── context/
│   └── AppDataContext.jsx   # events, fights, live scorecards, archive
├── data/
│   └── mockData.js          # seed events/fights (stand-in for the API)
├── services/                 # thin wrappers around fetch, one per resource
│   ├── api.js                # base client — auth header injection, error shape
│   ├── authService.js
│   ├── eventsService.js
│   └── scorecardsService.js
├── components/                # reusable, presentational pieces
│   ├── Layout.jsx, Masthead.jsx, Breadcrumbs.jsx, SectionLabel.jsx
│   ├── Pill.jsx, RingBadge.jsx, titleBadges.js
│   ├── FightTicket.jsx, ScorePick.jsx, KnockdownToggle.jsx
│   ├── StoppageModal.jsx, ArchiveCard.jsx, MiniScoreBox.jsx, ScoreChip.jsx
│   ├── FilterToggleChip.jsx, FormField.jsx
│   └── ProtectedRoute.jsx
└── pages/                     # one per route
    ├── EventsPage.jsx                 /
    ├── EventDetailPage.jsx            /events/:eventId
    ├── ScoringPage.jsx                /events/:eventId/fights/:fightId/score
    ├── ScorecardsPage.jsx             /scorecards
    ├── CreateEventPage.jsx            /events/create              (organizer only)
    ├── ManageEventsPage.jsx           /manage                     (organizer only)
    ├── AddUndercardFightPage.jsx      /manage/:eventId/add-fight  (organizer only)
    ├── LoginPage.jsx                  /login
    └── RegisterPage.jsx               /register
```

## Wiring up the real backend

`AppDataContext` currently holds all state client-side, seeded from
`mockData.js`. To connect it to a real API:

1. Stand up the Express/Prisma backend (routes matching `src/services/*.js`).
2. Replace the state initialization in `AppDataContext` with calls through
   `eventsService` / `scorecardsService` (e.g. a `useEffect` calling
   `eventsService.list()` on mount instead of reading `EVENTS`/`FIGHTS`
   directly from mock data).
3. `AuthContext` is already wired to `authService` and expects
   `POST /auth/register`, `POST /auth/login`, `GET /auth/me` returning
   `{ user, token }` / `{ user }` shapes — see `src/services/authService.js`.

## Notes

- Organizer-only routes are gated by `ProtectedRoute`, which checks
  `user.role === 'organizer'` (or `'admin'`) from `AuthContext`. Until a
  backend exists, no one can actually sign in, so those routes are
  effectively unreachable — expected for now.
- Tailwind's custom colors (`ink`, `corner-red`, `gold`, `wbc`, `wba`, `ibf`,
  `wbo`, `ring-red`/`ring-white`/`ring-blue`, etc.) live in
  `tailwind.config.js` under `theme.extend.colors`.
