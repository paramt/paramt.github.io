> **Keep this file current.** Whenever you change an existing approach or build something non-obvious, update or add the relevant section here before finishing the task. Stale docs cause repeat mistakes.
>
> Component and system deep-dives live in `.claude/docs/`. This file is for site-wide decisions and content workflows only.

---

# Adding New Content

## Adding an Image

Use the `/add-photo` skill — it handles compression, dimension extraction, rotation gotchas, and wiring into `heroPolaroids.js` or `timeline.js`.

## Adding a Timeline Note

Use the `note(text, color)` helper in the event's `attachments` array in `timeline.js`. No image or thumbnail needed.

- `text`: plain text with optional `[label](url)` markdown links.
- `color`: `yellow` (default), `blue`, `green`, `pink`, or `orange`.

## Adding a Route Event

Route events display a polyline on the map. Their `coords` field is a multi-point array rather than a single `{ lat, lng }`.

**1. Add the route to `src/data/routes.js`:**

```js
"My road trip": {
  points: 50,          // waypoints to sample from ORS (50 default, use more for long routes)
  endpoints: [
    { lat: ..., lng: ... },  // start
    { lat: ..., lng: ... },  // end
  ],
  waypoints: null,     // populated by npm run routes
},
```

**2. Reference it in `timeline.js`:**

```js
{ month: "Jun", title: "My road trip", coords: route("My road trip"), ... }
```

**3. Generate the full route:**

```bash
npm run routes
```

Calls OpenRouteService `driving-car` directions between the endpoints, samples `points` evenly spaced waypoints, and writes them back to `routes.js`. Requires `ORS_API_KEY` in `.env`. Add `--force` to regenerate routes that already have waypoints.

---

# Dark Mode

Light mode is the default. Dark mode is **only** activated by the manual toggle (stored as `'dark'` in `localStorage`). System preference is intentionally ignored.
- CSS: `html[data-theme="dark"]` in `index.css` overrides the CSS variables. No `@media (prefers-color-scheme: dark)` block.
- `Nav.jsx`: toggle sets/removes the `data-theme` attribute on `<html>` and `localStorage`. On mount, reads `localStorage` to restore state.
- `WorldMap.jsx`: see `.claude/docs/worldmap.md`.

---

# 404 Page

`404.html` is a second Vite entry point (configured in `vite.config.js` via `rollupOptions.input`). It loads `src/404-entry.jsx` → `src/components/NotFound.jsx`, which displays all 6 hero polaroids in a scattered gallery with a "404 / ← go home" footer. GitHub Pages automatically serves `dist/404.html` for unmatched URLs.

---

# Preloading & Caching

**GC pin:** Image/video objects are stored in a module-level `_preloaded` array in both `Hero.jsx` and `Timeline.jsx`. Without live references the GC can collect them and evict from the browser's memory cache, causing re-fetches. Keeping refs alive prevents this.

---

# Responsive Breakpoints

| Breakpoint | Effect |
|---|---|
| `< 600px` | Hero polaroid hidden (`display: none`); only last nav link shown |
| `< 860px` | Map column hidden; timeline thumb preloading skipped |
| `≥ 860px` | Map column visible (380px wide, sticky); nav/footer/layout max-width expanded by `380px + 56px` |

---

# Component Docs

| Component / System | Doc |
|---|---|
| Timeline (interaction model, state, CSS layout) | `.claude/docs/timeline.md` |
| WorldMap (props, markers, polylines, layers) | `.claude/docs/worldmap.md` |
| Polaroid (props, loading, HDR gotcha) | `.claude/docs/polaroid.md` |
| Hero Polaroid (localStorage, SSR) | `.claude/docs/hero.md` |
| Notes & SEO Prerender (pipeline, SSR, gotchas) | `.claude/docs/notes.md` |
