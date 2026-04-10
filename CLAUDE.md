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
- `allCoords` in `Timeline.jsx` is built by flatMapping all events — route events expand into one entry per waypoint, all sharing the same `event` reference.
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

## Loading Phases

Every `<Polaroid>` with a `thumb` prop goes through four phases:

| Phase | Placeholder | Thumb | Full image |
|---|---|---|---|
| Fetching | `position:absolute`, visible (overlays spacer) | `position:absolute` until loaded (out of flow, hidden behind placeholder) | `polaroid-img-loading` — absolute, `opacity:0` |
| Thumb loaded | fades to `opacity:0` (CSS transition, stays in DOM) | visible, in flow (sets container height) | `polaroid-img-loading` — absolute, `opacity:0` |
| Full image loaded | removed from DOM | still in flow | `polaroid-img-fading` — absolute, `opacity:0→1` over 400ms |
| Transition done (~400ms) | — | removed from DOM | no class — in flow, final size |

**Why the thumb stays in DOM during the full-image fade:** removing it at the same time the full image starts fading in would reveal the white polaroid background for 400ms. Keeping it in flow means the full image (absolute, on top) fades in over the thumb — no flash.

**State variables:**
- `loaded` — full image has finished downloading (fires `polaroid-img-fading`)
- `imgReady` — 400ms after `loaded`, set via `setTimeout(FILTER_DURATION)` (fires removal of thumb)
- `thumbLoaded` — thumb has finished downloading (fades placeholder out)

**Placeholder aspect ratio:** A hidden spacer `<div>` is rendered in flow inside `.polaroid-media` while `thumb && !thumbLoaded && !imgReady`. It has `aspect-ratio: w/h` (or `3/2` fallback) and is the sole in-flow element giving the container its height before the thumb loads. It is removed once the thumb loads (thumb takes over) or if the main image was already cached (`imgReady` true on mount, main img immediately in flow). The placeholder and thumb are both `position:absolute` during this phase so they don't stack with the spacer.

**Cached-image shortcut:** on mount, a `useEffect` checks `imgRef.current?.complete`. If true (image was preloaded into memory cache), both `loaded` and `imgReady` are set immediately — no thumb phase, full image shown directly.

**`key` prop on timeline polaroids:** `<Polaroid key={attachment.src} ...>` — using `src` as the key ensures React fully unmounts and remounts when switching timeline entries, resetting all loading state. Using `key={i}` (index) would reuse the component and bleed `loaded=true` from the previous entry.

## Props Reference

| Prop | Type | Effect |
|---|---|---|
| `src` | string | Full-res image URL |
| `thumb` | string | Thumbnail URL — triggers progressive loading |
| `w`, `h` | number | Full-res pixel dimensions for placeholder `aspect-ratio` |
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

**1. Generate a thumbnail.** Run from `src/data/images/`:

```bash
ffmpeg -y -i "input.jpg" -vf "scale='min(800,iw)':-1" "/tmp/thumb_tmp.png" 2>/dev/null && \
cwebp -q 50 -quiet "/tmp/thumb_tmp.png" -o "input.thumb.webp" && \
rm /tmp/thumb_tmp.png
```

Two steps (not ffmpeg alone) because ffmpeg preserves ICC color profiles in JPEG output, bloating the file. The PNG intermediate + cwebp strips it.

Target: ~5–10% of original. Verify: `echo "scale=1; $(stat -f%z input.thumb.webp) * 100 / $(stat -f%z input.jpg)" | bc`

Naming: `{original-name}.thumb.webp` in the same directory.

**2. Get the display dimensions** (`w` and `h`). Use Preview or Finder → Get Info — NOT `sips`.

**EXIF rotation warning:** `sips -g pixelWidth -g pixelHeight` reports raw sensor dimensions, ignoring EXIF orientation. iPhone portrait photos are stored landscape in the file (e.g. `4096x3072`) with an EXIF rotate tag — they display as portrait (`3072x4096`). Always use the **display** dimensions (what you see on screen) for `w`/`h`.

**3. Wire up:**
- **Hero:** import in `src/data/heroPolaroids.js`, add entry with `image`, `thumb`, `w`, `h`, and optional `video`, `location`, `date`.
- **Timeline image:** import in `src/data/timeline.js`, use `img(src, thumb, w, h)` in the event's `attachments` array.

## Adding a Timeline Note

Use the `note(text, color)` helper in the event's `attachments` array in `timeline.js`. No image or thumbnail needed.

- `text`: plain text with optional `[label](url)` markdown links.
- `color`: `yellow` (default), `blue`, `green`, `pink`, or `orange`.

---

# Preloading & Caching

**Hero (`Hero.jsx`):** All hero assets are preloaded in a single `requestIdleCallback` after the page loads, in three passes to respect browser download priority:
1. Thumbs (tiny, ~10–30KB each)
2. Full images
3. Videos

**Timeline (`Timeline.jsx`):** Only thumbs are preloaded (not full images, not videos). Full images load on first hover, then hit disk cache on repeat hovers — fast enough.

Preload triggers when the timeline section scrolls within 800px of the viewport (`IntersectionObserver` with `rootMargin: '800px'`), deferred to idle time. Skipped entirely on viewports narrower than 860px (polaroids are hidden there anyway).

**Why not preload full timeline images:** the full image set is ~100MB+. Pinning that in memory would cause memory pressure, jank, or tab kills on mobile. Disk cache is sufficient for repeat hovers.

**GC pin:** Image/video objects are stored in a module-level `_preloaded` array in both `Hero.jsx` and `Timeline.jsx`. Without live references the GC can collect them and evict from the browser's memory cache, causing re-fetches. Keeping refs alive prevents this.

---

# Dark Mode

Dark mode is **intentionally disabled**:
- CSS: the `@media (prefers-color-scheme: dark)` block is gated with `and (max-width: 0px)` so it never applies.
- `WorldMap.jsx`: `isDarkRef.current = false` is hardcoded; the `onChange` handler also sets it to `false`.

The CSS variables and WorldMap color branches still exist for future re-enabling, but dark mode has no effect at runtime.

---

# 404 Page

`404.html` is a second Vite entry point (configured in `vite.config.js` via `rollupOptions.input`). It loads `src/404-entry.jsx` → `src/components/NotFound.jsx`, which displays all 6 hero polaroids in a scattered gallery with a "404 / ← go home" footer. GitHub Pages automatically serves `dist/404.html` for unmatched URLs.

**CSS filter gotcha — ICC color profiles:** Applying *any* CSS `filter` (even `filter: grayscale(0%)`, which is visually a no-op) forces the browser into GPU compositing mode, which bypasses ICC color profile handling. Images with Display P3 or HDR gain maps render as sRGB, causing highlights to appear blown out. Color polaroids must use `filter: none`, not `filter: grayscale(0%)`. The same override applies on `:hover` via `.polaroid-color:hover img { filter: none }`.

---

# Responsive Breakpoints

| Breakpoint | Effect |
|---|---|
| `< 600px` | Hero polaroid hidden (`display: none`); only last nav link shown |
| `< 860px` | Map column hidden; timeline thumb preloading skipped |
| `≥ 860px` | Map column visible (380px wide, sticky); nav/footer/layout max-width expanded by `380px + 56px` |
