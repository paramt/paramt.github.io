# Hero Polaroid

The hero polaroid cycles through images in `heroPolaroids.js` — both on page load and when clicked. The index is persisted in `localStorage` so each load/click advances the sequence by one.

## Why `index` starts as `null`

The correct polaroid to show depends on `localStorage`, which isn't available on the server. Initializing with a fixed default (e.g. index 0) and swapping on hydration causes a visible flicker, so the polaroid is intentionally excluded from SSR output and rendered only on the client after `useLayoutEffect` fires.

## StrictMode double-invocation

`useLayoutEffect` is guarded by `initializedRef` so the localStorage read/write fires exactly once even in development, keeping click and refresh in the same sequence.

## Preloading

Hero images are preloaded immediately after page load. Videos are deferred to `requestIdleCallback` (they're large and not needed instantly).
