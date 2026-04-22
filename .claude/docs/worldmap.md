# WorldMap

**Props:** `coords`, `allCoords`, `allRoutes`, `noZoom`, `onMarkerHover`, `onMarkerLeave`, `onMarkerClick`.

- `coords` prop: `{ lat, lng } | Array<{ lat, lng }> | null` — single point or ordered route. Normalised internally to `coordsPts` (array or null) for uniform handling.
- Static markers (`allCoords`) carry the full event object (`{ lat, lng, event }`) so callbacks can pass it back. Use CSS class `map-marker-static` with `pointer-events: auto` (overrides parent `pointer-events: none`).
- `noZoom` prop: when true, `animateTo(WORLD)`; when false, `animateTo(targetBoundsFor(coordsPts))`.
- `targetBoundsFor` accepts an array: single point → existing CA/NA/WORLD zone logic; multiple points → dynamic bbox with 40% padding (minimum 2° lat, 3° lng).

## Active Markers

- Single-point events: one pulsing dot.
- Routes: two non-pulsing dots at the **start and end waypoints only** (not one per point).
- Rendered in `activeMarkersRef`, repositioned each animation frame.

## Route Polylines

- `drawRoute` draws a **solid** red line (`#eb4034`). For 2-point routes, a straight line; for 3+ waypoints, quadratic bezier curves through midpoints between consecutive waypoints (smooth corners).
- Background routes: when `!coordsPts || noZoom`, all routes from `allRoutes` are drawn at `alpha=0.25`; the active route (if any) is drawn on top at `alpha=0.55`.

## Map Layers

- Static markers stay visible during map-source interactions (`!coordsPts || noZoom`); hidden during timeline-source interactions.
- US state borders: drawn from `us-atlas` data, fading in as zoom increases past 5× (`stateOpacity = clamp((zoom-5)/5, 0, 1)`). Fully visible at CA zoom (~14×).
- `getIsDark()` checks only `data-theme === 'dark'`; a `MutationObserver` on `<html>` triggers re-renders on attribute change.
