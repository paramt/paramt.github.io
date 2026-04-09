# Timeline Interaction Model

The timeline has two parallel interaction sources — the entry list on the left and the world map on the right — and two interaction levels: hover (transient) and select (persistent). These combine into five states:

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

**State management (`Timeline.jsx`):**
- `hoveredEvent` / `selectedEvent` — React state, set by mouse/click handlers.
- `hoverSourceRef` / `selectedSourceRef` — refs tracking whether the active event came from `'timeline'` or `'map'`; determines `noZoom`.
- `activeEvent = hoveredEvent ?? selectedEvent` — drives map coords, polaroids, and dot/ribbon highlight.
- `noZoom` — true when the active source is `'map'`; WorldMap animates to `WORLD` instead of zooming to the location.
- `flat` is `useMemo`-ized so event object references are stable for `===` identity checks.
- `entryRefs` — a `Map<event, DOMElement>` used to scroll selected entries into view.

**Coordinate data format (`timeline.js`):**
- Each event has a `coords` field: `null` (no location), `{ lat, lng }` (single point), or `[{ lat, lng }, ...]` (ordered route/multi-point).
- `allCoords` in `Timeline.jsx` is built by flatMapping all events — route events expand into one entry per waypoint, all sharing the same `event` reference.
- `activeCoords = activeEvent?.coords ?? null` — passed directly to `WorldMap` as the `coords` prop.

**Hover hitbox:**
- `onMouseEnter`/`onMouseLeave` are on `.timeline-event`.
- When nothing is selected, `.timeline-event` spans the full column width — easy to discover hover by accident while scrolling.
- When an entry is selected, the `.timeline` container gets class `timeline--has-selection`, which applies `width: fit-content` to all entries via CSS. This shrinks each hitbox to text-only, preventing accidental hover from disturbing the selected state.
- The dot highlight uses `.timeline-event--active` and `.timeline-event--selected` CSS classes (not `:hover`) so it's driven purely by JS state.

**Selected style (month ribbon):**
- `.timeline-month::before` — always present but `scaleX(0)` by default; transitions to `scaleX(1)` when `.timeline-event--selected` is applied.
- Shape: `clip-path` polygon (pointed left tip, flat right edge at the vertical timeline line), positioned from `left: -8px` to `right: -12px` relative to the month cell.
- `transform-origin: right center` so it slides in/out from the timeline line.

**WorldMap (`WorldMap.jsx`):**
- `coords` prop: `{ lat, lng } | Array<{ lat, lng }> | null` — single point or ordered route.
- Normalised internally to `coordsPts` (array or null) for uniform handling.
- Static markers (`allCoords`) carry the full event object (`{ lat, lng, event }`) so callbacks can pass it back.
- `noZoom` prop: when true, `animateTo(WORLD)`; when false, `animateTo(targetBoundsFor(coordsPts))`.
- `targetBoundsFor` accepts an array: single point → existing CA/NA/WORLD zone logic; multiple points → dynamic bbox with 40% padding.
- Active markers: one pulsing dot per point in `coordsPts`; rendered in a shared container (`activeMarkersRef`) repositioned each animation frame.
- Route polyline: when `coordsPts.length > 1`, `drawRoute` draws a dashed red line on the canvas connecting waypoints in order.
- Static markers stay visible during map-source interactions (`!coordsPts || noZoom`); hidden during timeline-source interactions.
- Markers have `pointer-events: auto` (overrides the parent `pointer-events: none`) with `onMouseEnter`, `onMouseLeave`, and `onClick` callbacks.

---

# Hero Polaroid

The hero polaroid cycles through images in `heroPolaroids.js` — both on page load and when clicked. The index is persisted in `localStorage` so each load/click advances the sequence by one.

**Why `index` starts as `null` (no SSR):** The correct polaroid to show depends on `localStorage`, which isn't available on the server. Initializing with a fixed default (e.g. index 0) and swapping on hydration causes a visible flicker, so the polaroid is intentionally excluded from SSR output and rendered only on the client after `useLayoutEffect` fires.

**StrictMode double-invocation:** `useLayoutEffect` is guarded by `initializedRef` so the localStorage read/write fires exactly once even in development, keeping click and refresh in the same sequence.

---

# Image Loading, Preloading, and Caching

## Polaroid loading states (`Polaroid.jsx`)

Every `<Polaroid>` with a `thumb` prop goes through four phases:

| Phase | Placeholder | Thumb | Full image |
|---|---|---|---|
| Fetching | `position:absolute`, visible (sets min perceived height) | in flow, naturally invisible until loaded | `polaroid-img-loading` — absolute, `opacity:0` |
| Thumb loaded | fades to `opacity:0` (CSS transition, stays in DOM) | visible, in flow (sets container height) | `polaroid-img-loading` — absolute, `opacity:0` |
| Full image loaded | removed from DOM | still in flow | `polaroid-img-fading` — absolute, `opacity:0→1` over 400ms |
| Transition done (~400ms) | — | removed from DOM | no class — in flow, final size |

**Why the thumb stays in DOM during the full-image fade:** removing the thumb at the same time the full image starts fading in would reveal the white polaroid background for 400ms. Keeping it in flow means the full image (absolute, on top) fades in over the thumb — no flash.

**State variables:**
- `loaded` — full image has finished downloading (fires `polaroid-img-fading`)
- `imgReady` — 400ms after `loaded`, set via `setTimeout(FILTER_DURATION)` (fires removal of thumb)
- `thumbLoaded` — thumb has finished downloading (fades placeholder out)

**Cached-image shortcut:** on mount, a `useEffect` checks `imgRef.current?.complete`. If true (image was preloaded into memory cache), both `loaded` and `imgReady` are set immediately — no thumb phase, full image shown directly.

**`key` prop on timeline polaroids:** `<Polaroid key={attachment.src} ...>` — using `src` as the key ensures React fully unmounts and remounts when switching timeline entries, resetting all loading state. Using `key={i}` (index) would reuse the component and bleed `loaded=true` from the previous entry.

## Preloading strategy

**Hero (`Hero.jsx`):**  
All hero assets are preloaded in a single `requestIdleCallback` after the page loads, in three passes to respect browser download priority:
1. Thumbs (tiny, ~10–30KB each)
2. Full images
3. Videos

Image objects are stored in a module-level `_preloaded` array. This is intentional — without live references, the GC can collect the `Image` objects and evict them from the browser's memory cache, causing re-fetches on every click cycle. 6 hero images are small enough that pinning them in memory is fine.

**Timeline (`Timeline.jsx`):**  
Only thumbs are preloaded (not full images, not videos). Full images load on first hover, then hit disk cache on repeat hovers — fast enough.

Preload triggers when the timeline section scrolls within 800px of the viewport (`IntersectionObserver` with `rootMargin: '800px'`), also deferred to idle time. Refs are kept alive in a module-level `_preloaded` array for the same GC reason as above. Thumbs are small enough (~50KB each) that the memory footprint is acceptable.

**Why not preload full timeline images:** the full image set is ~100MB+. Pinning that in memory would cause memory pressure, jank, or tab kills on mobile. Disk cache is sufficient for repeat hovers.

---

# Thumbnail Compression

When adding a new image to the site (hero or timeline), generate a compressed WebP thumbnail alongside it. Run from `src/data/images/`:

```bash
ffmpeg -y -i "input.jpg" -vf "scale='min(800,iw)':-1" "/tmp/thumb_tmp.png" 2>/dev/null && \
cwebp -q 50 -quiet "/tmp/thumb_tmp.png" -o "input.thumb.webp" && \
rm /tmp/thumb_tmp.png
```

Two steps (not ffmpeg alone) because ffmpeg preserves ICC color profiles in JPEG output, bloating the file. The PNG intermediate + cwebp strips it.

Target: ~5–10% of original. Verify: `echo "scale=1; $(stat -f%z input.thumb.webp) * 100 / $(stat -f%z input.jpg)" | bc`

Naming: `{original-name}.thumb.webp` in the same directory.

Wire up:
- Hero: import in `src/data/heroPolaroids.js`, add `thumb` field to entry
- Timeline: import in `src/data/timeline.js`, wrap with `img(src, thumb)` helper
