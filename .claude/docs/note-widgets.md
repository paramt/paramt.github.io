# Note Widgets

Interactive React components embedded in notes via a fenced code block:

````md
```widget mac-studio-resale
some-prop: value
```
````

- `NotePre` in `src/components/note-widgets/index.jsx` is the react-markdown `pre` override (wired in `Notes.jsx`). A `pre` whose `code` child has `language-widget` renders a widget; everything else renders as a normal `<pre>`.
- The widget name is the first word of the fence **meta** (`code.data.meta`, which mdast-util-to-hast copies from the markdown fence), not part of the language tag.
- The block body is parsed as flat `key: value` lines into string props. No YAML dependency; add one only if a widget needs nested props.
- Register new widgets in the `WIDGETS` map. An unknown name **throws**, which fails `prerender.js`, so a typo in a note breaks the build instead of shipping a broken page.
- Components live here, not in the notes repo, because they depend on the site's build, CSS variables and dark mode. Notes only reference widgets by name, and Obsidian shows the block as plain code.

## Writing a widget

- Must be SSR-safe: no `window`/`document` during render. Do DOM/measurement work in `useEffect`. SSR emits only the static shell (e.g. an empty fixed-height figure and legend).
- Dark mode is `html[data-theme="dark"]`, not `prefers-color-scheme` (see CLAUDE.md). Scope colour tokens on the widget root and override them under `html[data-theme="dark"] .widget-root`. A widget that reads colours in JS (e.g. d3 charts via `getComputedStyle`) must redraw on theme change: `MacStudioResaleChart` uses a `MutationObserver` on `<html>`'s `data-theme`.
- Widgets are statically imported, so their code (and `d3`) ships in the notes bundle for every note. Switch to `React.lazy` with a client-only mount if this gets heavy; `renderToString` doesn't wait for Suspense.
