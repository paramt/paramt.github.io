> **Keep this file current.** Whenever you change an existing approach or build something non-obvious, update or add the relevant section here before finishing the task. Stale docs cause repeat mistakes.

# Timeline

The timeline has two parallel interaction sources — the entry list on the left and the world map on the right — and two interaction levels: hover (transient) and select (persistent).

## Interaction States

| State | Trigger | Map zoom | Polaroids | Dot | Month ribbon |
|---|---|---|---|---|---|
| Default | — | World | hidden | grey | hidden |
| Hover entry | mouse over entry text | zooms to location | shown | red | hidden |
| Hover map point | mouse over marker | stays at World | shown | red | hidden |
| Select entry | click entry | zooms to location | shown | red | slides in |
| Select map point | click marker | stays at World | shown | red | slides in |

**Key rules:**
- Hover always overrides select for display (preview other entries while one is selected).
- Clicking the active selection again deselects it; clicking a different entry/point switches selection.
- Selecting a map point scrolls its timeline entry into view (only if out of view, with navbar + breathing-room offset via `scroll-margin`).
- Entries without coordinates still have full hover/select states; polaroids show if images exist, map stays at World.

## State Management (`Timeline.jsx`)

- `hoveredEvent` / `selectedEvent` — React state, set by mouse/click handlers.
- `hoverSourceRef` / `selectedSourceRef` — refs tracking whether the active event came from `'timeline'` or `'map'`; determines `noZoom`.
- `activeEvent = hoveredEvent ?? selectedEvent` — drives map coords, polaroids, and dot/ribbon highlight.
- `noZoom` — true when the active source is `'map'`; WorldMap animates to `WORLD` instead of zooming to the location.
- `flat` is `useMemo`-ized so event object references are stable for `===` identity checks.
- `entryRefs` — a `Map<event, DOMElement>` used to scroll selected entries into view.

## Coordinate Data Format (`timeline.js`)

- Each event has a `coords` field: `null` (no location), `{ lat, lng }` (single point), or `[{ lat, lng }, ...]` (ordered route/multi-point).
- `allCoords` in `Timeline.jsx` is built by flatMapping all events — route events expand into two entries (start and end only), both sharing the same `event` reference. Intermediate waypoints are not included so the static marker dots don't clutter the map.
- `allRoutes` in `Timeline.jsx` is the list of multi-point `coords` arrays (one per route event); passed to `WorldMap` for background route rendering.
- `activeCoords = activeEvent?.coords ?? null` — passed directly to `WorldMap` as the `coords` prop.

## Hover Hitbox

- `onMouseEnter`/`onMouseLeave` are on `.timeline-event`.
- When nothing is selected, `.timeline-event` spans the full column width — easy to discover hover while scrolling.
- When an entry is selected, the `.timeline` container gets class `timeline--has-selection`, which applies `width: fit-content` to all entries via CSS. This shrinks each hitbox to text-only, preventing accidental hover from disturbing the selected state.
- The dot highlight uses `.timeline-event--active` and `.timeline-event--selected` CSS classes (not `:hover`) so it's driven purely by JS state.

## Month Ribbon (selected style)

- `.timeline-month::before` — always present but `scaleX(0)` by default; transitions to `scaleX(1)` when `.timeline-event--selected` is applied.
- Shape: `clip-path` polygon (pointed left tip, flat right edge at the vertical timeline line), positioned from `left: -8px` to `right: -12px` relative to the month cell.
- `transform-origin: right center` so it slides in/out from the timeline line.

## Attachments

Each timeline event can have an `attachments` array containing two types:

**Images** (`type: 'image'`) — rendered as `<Polaroid color static .../>`:
- `color` prop: disables the grayscale/sepia filter so images appear in full color.
- `static` prop: disables the scale-up hover transform (the polaroid stays at its rotation angle), appropriate for the fixed side-panel context.

**Notes** (`type: 'note'`) — rendered as `<StickyNote text color />`:
- Supports inline markdown links: `[label](url)` syntax — parsed by `StickyNote` into `<a>` tags that open in a new tab.
- Color themes: `yellow` (default), `blue`, `green`, `pink`, `orange`.
- Rotation is randomized via `useMemo` (stable per render cycle).

Both types are mixed freely in `attachments` and rendered in order in the `.timeline-polaroids` flex container.

---

# WorldMap

**Props:** `coords`, `allCoords`, `allRoutes`, `noZoom`, `onMarkerHover`, `onMarkerLeave`, `onMarkerClick`.

- `coords` prop: `{ lat, lng } | Array<{ lat, lng }> | null` — single point or ordered route. Normalised internally to `coordsPts` (array or null) for uniform handling.
- Static markers (`allCoords`) carry the full event object (`{ lat, lng, event }`) so callbacks can pass it back. Use CSS class `map-marker-static` with `pointer-events: auto` (overrides parent `pointer-events: none`).
- `noZoom` prop: when true, `animateTo(WORLD)`; when false, `animateTo(targetBoundsFor(coordsPts))`.
- `targetBoundsFor` accepts an array: single point → existing CA/NA/WORLD zone logic; multiple points → dynamic bbox with 40% padding (minimum 2° lat, 3° lng).

**Active markers:**
- Single-point events: one pulsing dot.
- Routes: two non-pulsing dots at the **start and end waypoints only** (not one per point).
- Rendered in `activeMarkersRef`, repositioned each animation frame.

**Route polylines:**
- `drawRoute` draws a **solid** red line (`#eb4034`). For 2-point routes, a straight line; for 3+ waypoints, quadratic bezier curves through midpoints between consecutive waypoints (smooth corners).
- Background routes: when `!coordsPts || noZoom`, all routes from `allRoutes` are drawn at `alpha=0.25`; the active route (if any) is drawn on top at `alpha=0.55`.

**Map layers:**
- Static markers stay visible during map-source interactions (`!coordsPts || noZoom`); hidden during timeline-source interactions.
- US state borders: drawn from `us-atlas` data, fading in as zoom increases past 5× (`stateOpacity = clamp((zoom-5)/5, 0, 1)`). Fully visible at CA zoom (~14×).

---

# Hero Polaroid

The hero polaroid cycles through images in `heroPolaroids.js` — both on page load and when clicked. The index is persisted in `localStorage` so each load/click advances the sequence by one.

**Why `index` starts as `null` (no SSR):** The correct polaroid to show depends on `localStorage`, which isn't available on the server. Initializing with a fixed default (e.g. index 0) and swapping on hydration causes a visible flicker, so the polaroid is intentionally excluded from SSR output and rendered only on the client after `useLayoutEffect` fires.

**StrictMode double-invocation:** `useLayoutEffect` is guarded by `initializedRef` so the localStorage read/write fires exactly once even in development, keeping click and refresh in the same sequence.

---

# Polaroid Component

## Loading

`<Polaroid>` shows a placeholder icon while `src` loads, then reveals the image. State: `loaded` (boolean). On mount, checks `imgRef.current?.complete` to handle browser-cached images.

**`key` prop on timeline polaroids:** `<Polaroid key={attachment.src} ...>` — using `src` as the key ensures React fully unmounts and remounts when switching timeline entries, resetting `loaded` state.

## Props Reference

| Prop | Type | Effect |
|---|---|---|
| `src` | string | Image URL (use the `.thumb.webp` — no full-res needed) |
| `w`, `h` | number | Image dimensions — used for the loading placeholder aspect ratio |
| `video` | string | Video URL — plays on hover after a 400ms delay |
| `rotate` | number | Fixed rotation in degrees; random if omitted |
| `color` | bool | Disables grayscale/sepia filter (default: greyscale) |
| `static` | bool | Disables scale-up on hover |
| `priority` | bool | Sets `fetchPriority="high"` on the `<img>` tag |
| `tack` | bool | Show/hide the pushpin at the top (default: true) |
| `location`, `date` | string | Shown in handwritten font below the image |
| `onClick` | fn | Makes polaroid clickable (cursor changes to pointer) |

---

# Adding New Content

## Adding an Image

**1. Compress the photo.** This produces the only copy that gets served. Run from `src/data/images/`:

```bash
ffmpeg -y -i "input.jpg" -vf "scale='min(800,iw)':-1" "/tmp/thumb_tmp.png" 2>/dev/null && \
cwebp -q 50 -quiet "/tmp/thumb_tmp.png" -o "input.thumb.webp" && \
rm /tmp/thumb_tmp.png
```

Two steps (not ffmpeg alone) because ffmpeg preserves ICC color profiles in JPEG output, bloating the file. The PNG intermediate + cwebp strips it.

Target: ~5–10% of original. Verify: `echo "scale=1; $(stat -f%z input.thumb.webp) * 100 / $(stat -f%z input.jpg)" | bc`

Naming: `{original-name}.thumb.webp` in the same directory.

**2. Compress the video (if any).** Run from the video's directory:

```bash
ffmpeg -y -i "input.mp4" -vf "scale='if(gt(iw,ih),640,-2)':'if(gt(iw,ih),-2,640)'" -c:v libx264 -crf 28 -preset fast -an -movflags +faststart "input.mp4"
```

Scales to max 640px on the longer dimension, strips audio (videos are muted). Expect ~90% size reduction.

**3. Wire up:**
- **Hero:** import the `.thumb.webp` in `src/data/heroPolaroids.js`, add entry with `image` (the thumb), `w`, `h`, and optional `video`, `location`, `date`.
- **Timeline image:** import the `.thumb.webp` in `src/data/timeline.js`, use `img(src, w, h)` in the event's `attachments` array.

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

This calls OpenRouteService `driving-car` directions between the endpoints, samples `points` evenly spaced waypoints from the result, and writes them back to `routes.js`. Requires `ORS_API_KEY` in `.env`. Add `--force` to regenerate routes that already have waypoints.

**How it works end-to-end:**
- `route(title)` (exported from `routes.js`) returns `waypoints ?? endpoints` — so the route renders as a straight line between start/end until ORS data is generated.
- `Timeline.jsx` passes `e.coords` (the full waypoints) directly to `WorldMap` — no lookup needed at render time.
- Static map markers for route events show only start and end dots, not intermediate waypoints.

---

# Preloading & Caching

**Hero (`Hero.jsx`):** Hero images are preloaded immediately after page load. Videos are deferred to `requestIdleCallback` (they're large and not needed instantly).

**Timeline (`Timeline.jsx`):** Images (thumbs) are preloaded when the timeline section scrolls within 200px of the viewport (`IntersectionObserver` with `rootMargin: '200px'`). Skipped entirely on viewports narrower than 860px (polaroids are hidden there anyway).

**GC pin:** Image/video objects are stored in a module-level `_preloaded` array in both `Hero.jsx` and `Timeline.jsx`. Without live references the GC can collect them and evict from the browser's memory cache, causing re-fetches. Keeping refs alive prevents this.

---

# Dark Mode

Light mode is the default. Dark mode is **only** activated by the manual toggle (stored as `'dark'` in `localStorage`). System preference is intentionally ignored.
- CSS: `html[data-theme="dark"]` in `index.css` overrides the CSS variables. No `@media (prefers-color-scheme: dark)` block.
- `Nav.jsx`: toggle sets/removes the `data-theme` attribute on `<html>` and `localStorage`. On mount, reads `localStorage` to restore state.
- `WorldMap.jsx`: `getIsDark()` checks only `data-theme === 'dark'`; a `MutationObserver` on `<html>` triggers re-renders on attribute change.

---

# 404 Page

`404.html` is a second Vite entry point (configured in `vite.config.js` via `rollupOptions.input`). It loads `src/404-entry.jsx` → `src/components/NotFound.jsx`, which displays all 6 hero polaroids in a scattered gallery with a "404 / ← go home" footer. GitHub Pages automatically serves `dist/404.html` for unmatched URLs.

**HDR gotcha — sepia filter interaction:** iPhone photos with HDR gain maps render in HDR by default when the browser supports it. Applying a `sepia` or `grayscale` filter on top of an HDR image causes severe highlight clipping — whites blow out badly because the filter is applied after tone mapping in HDR headroom. `dynamic-range-limit: standard` on `.polaroid img` and `.polaroid-thumb` clamps images to SDR first, after which filters apply cleanly.

---

# Timeline Polaroids — short viewport behaviour

On desktop (`≥ 860px`), the entire right rail is a sticky, viewport-bounded column: `.timeline-map-col` uses `height: calc(100svh - var(--nav-height) - 48px)` and `container-type: size`, so the map and attachments respond to the height actually available under the navbar instead of overflowing past the fold.

- The rail width now shrinks with available height via `width: clamp(280px, calc(var(--timeline-rail-height) * 0.78), 380px)`.
- The right rail is a flex column, but `.map-frame` is `flex: 0 0 auto` so it sizes to its actual rendered content instead of stretching to fill a fixed fraction of the rail. `.timeline-polaroids` takes the remaining height (`flex: 1 1 auto`).
- The attachment grid packs upward: `.timeline-polaroids` uses `align-items: start` and `align-content: start`, so cards sit at the top of their cells/rows instead of vertically centering within leftover space.
- For 3- and 4-item layouts, the grid does **not** use fixed `1fr` row tracks. Rows size to their content, so any leftover attachment height collects at the bottom of the rail rather than being split into a large gap between rows.
- In 3-item layouts, if the trailing attachment is an image (`.polaroid:last-child`), it spans both columns. Its width cap is based on roughly the lower half of the attachment rail (`48cqh`) rather than the full container height, so it can use the otherwise-empty half-row without overflowing when the remaining height is tight.
- `Timeline.jsx` adds a count modifier class (`timeline-polaroids--count-1` … `--count-4`) so CSS can size 1-, 2-, and 4-item attachment layouts differently without measuring in JS.
- Timeline polaroids no longer stretch to fill grid-row height. Instead, each count layout sets explicit size tokens on the card (`--timeline-polaroid-width`, `--timeline-polaroid-pad-x`, `--timeline-polaroid-pad-bottom`, etc.). Width is expressed as `min(100%, <height-derived cap>)`, so cards grow to fill the available row/column width when they can, but are still constrained by height on short screens.
- Sticky notes intentionally do not participate in that responsive scaling. In the timeline rail they keep a fixed square footprint (`160px`) with fixed padding tokens (`22px 14px 14px`) so their handwritten note look stays consistent across events.
- `.map-frame` sizes from container height too (`width: min(100%, calc((44cqh - paddingTop) * 400 / 260))`). The lower `44cqh` cap makes the map begin shrinking earlier as viewport height decreases, so the polaroids do not absorb all of the initial height pressure on short screens.
- `WorldMap` still has a `ResizeObserver` that redraws whenever the canvas size changes.

---

# Notes & SEO Prerender

Notes are markdown files in `src/data/notes/` with YAML-ish frontmatter (`title`, `date`, `description`, optional `unlisted: true`). Each gets a permalink at `/notes/<slug>` with fully server-rendered HTML (content, KaTeX math, plus per-page SEO meta).

## Pipeline

Build order (`package.json`): `vite build` → `vite build --ssr src/entry-server.jsx --outDir dist-server` → `node prerender.js`. A single pass of `prerender.js` does **everything**: home, `/notes` listing, every `/notes/<slug>/index.html`, and `dist/sitemap.xml`. There is **no** separate `generate-notes-pages.js` — the SSR bundle is needed to render note bodies, so consolidating into prerender means `dist-server` is still available at that point (it's deleted at the end of prerender).

## Shared loader (`src/data/notes-loader.js`)

Both `Notes.jsx` (client + SSR) and `entry-server.jsx` import from here. Uses `import.meta.glob('./notes/*.md', { query: '?raw', import: 'default', eager: true })` which resolves identically in client and SSR Vite builds. Exports `parseFrontmatter`, `getAllNotes()`, `getNote(slug)`.

### Note-local images

Markdown note images live alongside the `.md` files in `src/data/notes/`. Local image references resolve to `/notes-media/<filename>`:

- Standard Markdown images are supported: `![alt](image.png)`.
- Obsidian embeds are also supported and normalized at load time: `![[image.png]]` and `![[image.png|alt text]]`.
- Bare Obsidian filenames are resolved by basename across the whole `src/data/notes/` tree, so `![[1.png]]` still works after moving attachments into a nested folder like `src/data/notes/images/...`.
- Relative paths are preserved when present, e.g. `![alt](images/post/foo.png)` or `![[images/post/foo.png]]`.
- External URLs and root-relative `/...` image URLs are left untouched.
- Dev server: `vite.config.js` serves `/notes-media/*` directly from `src/data/notes/`.
- Production build: `prerender.js` copies note-local image files (`png`, `jpg`, `jpeg`, `webp`, `gif`, `avif`, `svg`) into `dist/notes-media/`.

## SSR-safety in `Notes.jsx`

The component accepts `initialSlug` as a prop — it must **not** touch `window` at render time. Client entry (`src/notes-entry.jsx`) parses `window.location.pathname` once and passes it in; SSR passes the slug directly. The `popstate` handler reads `window.location` inside `useEffect`, which is safe because effects don't run during SSR. Both client entries (`main.jsx` and `notes-entry.jsx`) use `hydrateRoot` when server-rendered markup is present.

## Meta injection

`notes.html` has a `<!--ssr-head-->` sentinel right before `</head>`. `prerender.js` replaces it per page with `<title>`, description, canonical, Open Graph, Twitter card, and (for note pages) an `Article` JSON-LD block. **`notes.html` must not contain its own `<title>`** — browsers use the first `<title>` they parse, so a baseline would override the injected per-page title.

**GitHub Pages URL-resolution gotcha:** Vite emits `dist/notes.html` (multi-page input), and prerender writes the processed listing to `dist/notes/index.html`. GitHub Pages resolves `/notes` to `notes.html` **before** `notes/index.html`, so the raw `<!--ssr-head-->` template would be served in prod with no title. `vite preview` uses the opposite order, so this bug does not reproduce locally. Prerender deletes `dist/notes.html` at the end as cleanup.

## Unlisted notes

Intentional design: unlisted notes behave like unlisted YouTube videos. The permalink works (the `index.html` is still generated), but:
- `<meta name="robots" content="noindex, follow" />` is injected, so crawlers that hit the URL via backlinks won't index it.
- The slug is excluded from `dist/sitemap.xml`.
- It's filtered from the `/notes` listing UI (`Notes.jsx`).

## Sitemap

Generated at `dist/sitemap.xml` during prerender. `public/sitemap.xml` must **not** exist — Vite would copy it over the generated one. Static routes (`/`, `/notes`, `/poker`, `/poker-analytics`) are hardcoded in `STATIC_SITEMAP_ROUTES` in `prerender.js`. Notes are appended from `getAllNotes()`, skipping `unlisted`.

---

# Responsive Breakpoints

| Breakpoint | Effect |
|---|---|
| `< 600px` | Hero polaroid hidden (`display: none`); only last nav link shown |
| `< 860px` | Map column hidden; timeline thumb preloading skipped |
| `≥ 860px` | Map column visible (380px wide, sticky); nav/footer/layout max-width expanded by `380px + 56px` |
