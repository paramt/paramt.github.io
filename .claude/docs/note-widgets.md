# Note Widgets

Interactive React components embedded in notes via a fenced code block:

````md
```widget mac-studio-resale
some-prop: value
```
````

## Where things live

- **Widget components live in the notes repo**, at `widgets/<name>/index.jsx` (default export), with any data/CSS beside them. All note content and its commits stay in that repo. `sync-notes.js` copies them into `src/data/notes/widgets/` like everything else.
- **The mechanism lives here**: `src/components/note-widgets/index.jsx` auto-registers every `src/data/notes/widgets/*/index.jsx` via `import.meta.glob`, keyed by folder name. Nothing in this repo changes when a widget is added.
- Widget imports (`react`, `d3`, ...) resolve from **this repo's** `node_modules`, because the synced copy sits inside this tree. A widget that needs a new npm package needs it added to this repo's `package.json`.
- The notes repo has no build or lint, so widget errors only surface on this repo's `npm run build`. A synced widget is a copy, so editing it in the notes repo needs `npm run dev` restarted (re-sync) to show up.

## Rendering

- `NotePre` is the react-markdown `pre` override (wired in `Notes.jsx`). A `pre` whose `code` child has `language-widget` renders a widget; everything else renders as a normal `<pre>`.
- The widget name is the first word of the fence **meta** (`code.data.meta`, which mdast-util-to-hast copies from the markdown fence), not part of the language tag.
- The block body is parsed as flat `key: value` lines into string props. No YAML dependency.
- An unknown name **throws**, which fails `prerender.js`. So a note using a widget must land together with (or after) the widget folder in the notes repo.

## Writing a widget

- Must be SSR-safe: no `window`/`document` during render. Do DOM/measurement work in `useEffect`.
- Dark mode is `html[data-theme="dark"]`, not `prefers-color-scheme` (see CLAUDE.md). Scope colour tokens on the widget root and override them under `html[data-theme="dark"] .widget-root`. A widget that reads colours in JS (d3 via `getComputedStyle`) must redraw on theme change, e.g. a `MutationObserver` on `<html>`'s `data-theme` (see `mac-studio-resale`).
- Widgets are eagerly imported, so their code (and `d3`) ships in the notes bundle for every note. Switch to lazy loading with a client-only mount if this gets heavy; `renderToString` doesn't wait for Suspense.
