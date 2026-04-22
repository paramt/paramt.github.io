# Timeline

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

## Route Events — how it works end-to-end

- `route(title)` (exported from `routes.js`) returns `waypoints ?? endpoints` — so the route renders as a straight line between start/end until ORS data is generated.
- `Timeline.jsx` passes `e.coords` (the full waypoints) directly to `WorldMap` — no lookup needed at render time.
- Static map markers for route events show only start and end dots, not intermediate waypoints.

## Preloading

Images (thumbs) are preloaded when the timeline section scrolls within 200px of the viewport (`IntersectionObserver` with `rootMargin: '200px'`). Skipped entirely on viewports narrower than 860px (polaroids are hidden there anyway).

## Short Viewport Behaviour (desktop ≥ 860px)

The entire right rail is a sticky, viewport-bounded column: `.timeline-map-col` uses `height: calc(100svh - var(--nav-height) - 48px)` and `container-type: size`, so the map and attachments respond to the height actually available under the navbar instead of overflowing past the fold.

- The rail width shrinks with available height via `width: clamp(280px, calc(var(--timeline-rail-height) * 0.78), 380px)`.
- The right rail is a flex column, but `.map-frame` is `flex: 0 0 auto` so it sizes to its actual rendered content instead of stretching to fill a fixed fraction of the rail. `.timeline-polaroids` takes the remaining height (`flex: 1 1 auto`).
- The attachment grid packs upward: `.timeline-polaroids` uses `align-items: start` and `align-content: start`, so cards sit at the top of their cells/rows instead of vertically centering within leftover space.
- For 3- and 4-item layouts, the grid does **not** use fixed `1fr` row tracks. Rows size to their content, so any leftover attachment height collects at the bottom of the rail rather than being split into a large gap between rows.
- In 3-item layouts, if the trailing attachment is an image (`.polaroid:last-child`), it spans both columns. Its width cap is based on roughly the lower half of the attachment rail (`48cqh`) rather than the full container height, so it can use the otherwise-empty half-row without overflowing when the remaining height is tight.
- `Timeline.jsx` adds a count modifier class (`timeline-polaroids--count-1` … `--count-4`) so CSS can size 1-, 2-, and 4-item attachment layouts differently without measuring in JS.
- Timeline polaroids no longer stretch to fill grid-row height. Instead, each count layout sets explicit size tokens on the card (`--timeline-polaroid-width`, `--timeline-polaroid-pad-x`, `--timeline-polaroid-pad-bottom`, etc.). Width is expressed as `min(100%, <height-derived cap>)`, so cards grow to fill the available row/column width when they can, but are still constrained by height on short screens.
- Sticky notes intentionally do not participate in that responsive scaling. In the timeline rail they keep a fixed square footprint (`160px`) with fixed padding tokens (`22px 14px 14px`) so their handwritten note look stays consistent across events.
- `.map-frame` sizes from container height too (`width: min(100%, calc((44cqh - paddingTop) * 400 / 260))`). The lower `44cqh` cap makes the map begin shrinking earlier as viewport height decreases, so the polaroids do not absorb all of the initial height pressure on short screens.
- `WorldMap` still has a `ResizeObserver` that redraws whenever the canvas size changes.
