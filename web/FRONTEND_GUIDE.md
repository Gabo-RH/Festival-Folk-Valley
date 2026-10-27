# Vue Front-end Developer Guide

This guide is a handoff for building the FestivalFlow web front end with Vue 3. It describes the current project setup and backend contract, and separates what already exists from what still needs to be implemented.

## Project at a glance

- **Front end:** Vue 3, Vite, JavaScript ES modules.
- **Routing:** `vue-router` is installed, but the app does not currently configure or use it.
- **Backend:** Express API, mounted under `/api`, on port `6767` by default.
- **Database:** SQLite. Artist and leaderboard responses are database rows, including an `id`.
- **Design goal:** Mobile-first festival companion for browsing artists, planning a schedule, playing the mini-game, and viewing scores.

Useful files:

- `src/main.js` mounts the Vue app.
- `src/App.vue` is currently the home page and imports `Navbar.vue`.
- `src/` contains the intended views and components, including `LineupView.vue`, `DetailView.vue`, `ScheduleView.vue`, `GameView.vue`, `LeaderboardView.vue`, and `ArtistCard.vue`. Several of these files are currently empty or not connected to the app.
- `src/api.js` is currently empty; use it for shared API requests.
- `backend/server.js` starts the API and mounts `backend/router.js` at `/api`.
- `vite.config.js` sets the `@` alias to `src/`.

## Get the app running

Run commands from the `web/` directory.

1. Install dependencies once:

   ```sh
   npm install
   ```

2. Start the API in one terminal:

   ```sh
   node backend/server.js
   ```

   The API listens on `http://localhost:6767` unless the `PORT` environment variable is set. It creates the SQLite tables and seeds the artist list on startup.

3. Start the Vue development server in another terminal:

   ```sh
   npm run dev
   ```

4. Open the local URL printed by Vite (usually `http://localhost:5173`).

### API connectivity in development

The Vite config currently has no API proxy, and the Express server does not enable CORS. A browser request from Vite's origin directly to port `6767` will therefore be blocked by the browser's cross-origin policy.

Recommended development setup: add a Vite proxy for `/api` to `http://localhost:6767`, then have the front end request relative URLs such as `/api/artists`. Alternatively, configure CORS on the backend. For production, route `/api` to the backend through the deployment's reverse proxy; do not hard-code `localhost` as the production API host.

## Suggested Vue structure

Use Vue single-file components and the Composition API with `<script setup>`, matching the existing component style.

- Keep `App.vue` as the shared shell and render the active page through Vue Router.
- Add routes for the home page, lineup, artist detail, schedule, mini-game, and leaderboard.
- Keep reusable UI in components such as `ArtistCard.vue`.
- Put shared HTTP request and response handling in `src/api.js`.
- Keep page-specific state and behavior close to the relevant view. Extract a composable only when logic is shared or makes a view difficult to follow.
- Use `@/...` imports for files under `src/`.

The current `main.js` only mounts `App.vue`. To use the already-installed Vue Router, create the router, register routes, and install it on the app before mounting. Confirm routes and navigation work after connecting the pages; the listed view filenames alone do not mean routing is implemented.

## Current API contract

All paths below are relative to `/api`. Successful responses are JSON. Errors use an object shaped like `{ "error": "message" }`.

### Artists

| Method and path | Behavior | Response |
|---|---|---|
| `GET /artists` | Lists artists; accepts optional `name`, `genre`, and `stage` query parameters. | Array of artist rows. |
| `GET /artists/:id` | Retrieves one artist by numeric database ID. | Artist row, or `404` with `{ "error": "Artist not found" }`. |
| `POST /artists` | Adds an artist. This is an existing API endpoint, not necessarily a public front-end feature. | Created artist row (`201`). |

The list filters can be combined. Each performs a case-insensitive substring match, and combined filters use AND logic. For example:

```text
/api/artists?genre=rock&stage=Main%20Stage
```

Artist rows have this shape:

```json
{
  "id": 1,
  "name": "Artist name",
  "genre": "Genre, Other Genre",
  "stage": "Main Stage",
  "start_time": "2026-07-18T18:00:00",
  "end_time": "2026-07-18T19:30:00",
  "bio": "Artist biography",
  "photo_url": "https://example.com/artist.jpg"
}
```

`start_time` and `end_time` are currently ISO-like text values without an explicit timezone. Avoid assuming they are UTC; display festival times consistently as the supplied local time unless the backend contract is changed.

### Leaderboard

| Method and path | Behavior | Response |
|---|---|---|
| `GET /leaderboard` | Returns the top 10 entries ordered by descending score. | Array of leaderboard rows. |
| `POST /leaderboard` | Adds a score entry. | Created leaderboard row (`201`). |

Submit entries with `player`, `score`, and `difficulty`. The backend sets `created_at` itself. A response row includes `id`, `player`, `score`, `difficulty`, and `created_at`.

### Errors and validation

Artist and leaderboard routes can return `500` with an `error` message if database work fails. The API currently does not provide detailed validation errors; do not assume fields are validated server-side. Show a useful error state in the UI when a request fails, and validate user-entered values in the form before submission.

## API client pattern

Centralize `fetch` handling in `src/api.js` so every view consistently checks HTTP status and parses JSON. For example:

```js
const API_BASE = '/api'

async function request(path, options) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  const body = await response.json()

  if (!response.ok) {
    throw new Error(body.error || `Request failed (${response.status})`)
  }

  return body
}

export const getArtists = (filters = {}) => {
  const query = new URLSearchParams(filters)
  const suffix = query.size ? `?${query}` : ''
  return request(`/artists${suffix}`)
}

export const getArtist = (id) => request(`/artists/${encodeURIComponent(id)}`)
export const getLeaderboard = () => request('/leaderboard')

export const submitScore = (entry) =>
  request('/leaderboard', {
    method: 'POST',
    body: JSON.stringify(entry),
  })
```

Keep loading, empty, and error states explicit in each view. Do not silently replace a failed API response with sample data.

## Feature guidance

### Lineup and artist details

- Load the lineup from `GET /artists`; use query parameters for name, genre, and stage filters.
- Render each artist as a reusable card with name, genre, stage, and formatted start time.
- Link to an artist detail route that loads `GET /artists/:id`.
- Handle missing artist IDs with a clear not-found state.
- Provide a fallback image or accessible text if `photo_url` is empty or the image fails to load.

### Personal schedule

The functional requirements call for a personal schedule stored in browser `localStorage`; there is no schedule API endpoint. Store selected artist IDs (or a small, versioned snapshot) in local storage, and resolve them against the loaded artist list so schedule data stays consistent with the API.

- Let users add and remove performances.
- Warn when selected performances overlap. Compare the time intervals, not only whether their start times match.
- Handle invalid or missing time values without crashing the schedule view.
- Keep this feature usable without creating an account or sending personal schedule data to the backend.

### Mini-game and leaderboard

The game view should host the game integration agreed with the game development team (for example, an iframe or JavaScript module). The API currently only supports leaderboard reads and score submissions; it does not provide game content or score validation.

- Fetch leaderboard entries from `GET /leaderboard`.
- Submit a completed score with `POST /leaderboard` using `player`, `score`, and `difficulty`.
- Handle loading and request errors, and refresh or update the list after a successful submission.
- Do not treat a client-submitted score as trusted or secure; server-side score validation is not currently implemented.

## UI quality checklist

- Design mobile-first, then verify wider layouts.
- Use semantic HTML, descriptive image alt text, visible keyboard focus, and labeled form controls.
- Make navigation and interactive controls usable by keyboard and touch.
- Include loading, empty, success, and error states for asynchronous pages.
- Format performance times consistently and make overlap warnings understandable.
- Respect reduced-motion preferences when adding animations.

## Before handoff

- Verify navigation to every page and back/forward browser behavior.
- Test artist filters individually and in combination, plus an unknown artist ID.
- Test an empty schedule, duplicate selections, overlapping performances, and schedule persistence after refresh.
- Test leaderboard loading, empty results, and a score submission.
- Run a production build:

  ```sh
  npm run build
  ```
