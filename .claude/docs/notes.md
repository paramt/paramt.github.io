# Notes & SEO Prerender

Notes are markdown files in `src/data/notes/` with YAML-ish frontmatter (`title`, `date`, `description`, optional `unlisted: true`). Each gets a permalink at `/notes/<slug>` with fully server-rendered HTML (content, KaTeX math, plus per-page SEO meta).

## Pipeline

Build order (`package.json`): `vite build` → `vite build --ssr src/entry-server.jsx --outDir dist-server` → `node prerender.js`. A single pass of `prerender.js` does **everything**: home, `/notes` listing, every `/notes/<slug>/index.html`, and `dist/sitemap.xml`. There is **no** separate `generate-notes-pages.js` — the SSR bundle is needed to render note bodies, so consolidating into prerender means `dist-server` is still available at that point (it's deleted at the end of prerender).

## Shared Loader (`src/data/notes-loader.js`)

Both `Notes.jsx` (client + SSR) and `entry-server.jsx` import from here. Uses `import.meta.glob('./notes/*.md', { query: '?raw', import: 'default', eager: true })` which resolves identically in client and SSR Vite builds. Exports `parseFrontmatter`, `getAllNotes()`, `getNote(slug)`.

## Note-local Images

Markdown note images live alongside the `.md` files in `src/data/notes/`. Local image references resolve to `/notes-media/<filename>`:

- Standard Markdown images: `![alt](image.png)`.
- Obsidian embeds are normalized: `![[image.png]]` and `![[image.png|alt text]]`.
- Bare Obsidian filenames are resolved by basename across the whole `src/data/notes/` tree, so `![[1.png]]` still works after moving attachments into a nested folder like `src/data/notes/images/...`.
- Relative paths are preserved when present, e.g. `![alt](images/post/foo.png)` or `![[images/post/foo.png]]`.
- External URLs and root-relative `/...` image URLs are left untouched.
- Dev server: `vite.config.js` serves `/notes-media/*` directly from `src/data/notes/`.
- Production build: `prerender.js` copies note-local image files (`png`, `jpg`, `jpeg`, `webp`, `gif`, `avif`, `svg`) into `dist/notes-media/`.

## SSR-safety in `Notes.jsx`

The component accepts `initialSlug` as a prop — it must **not** touch `window` at render time. Client entry (`src/notes-entry.jsx`) parses `window.location.pathname` once and passes it in; SSR passes the slug directly. The `popstate` handler reads `window.location` inside `useEffect`, which is safe because effects don't run during SSR. Both client entries (`main.jsx` and `notes-entry.jsx`) use `hydrateRoot` when server-rendered markup is present.

## Meta Injection

`notes.html` has a `<!--ssr-head-->` sentinel right before `</head>`. `prerender.js` replaces it per page with `<title>`, description, canonical, Open Graph, Twitter card, and (for note pages) an `Article` JSON-LD block.

## Gotchas

**`notes.html` must not contain its own `<title>`** — browsers use the first `<title>` they parse, so a baseline would override the injected per-page title.

**GitHub Pages URL-resolution:** Vite emits `dist/notes.html` (multi-page input), and prerender writes the processed listing to `dist/notes/index.html`. GitHub Pages resolves `/notes` to `notes.html` **before** `notes/index.html`, so the raw `<!--ssr-head-->` template would be served in prod with no title. `vite preview` uses the opposite order, so this bug does not reproduce locally. Prerender deletes `dist/notes.html` at the end as cleanup.

**`public/sitemap.xml` must not exist** — Vite would copy it over the generated one at `dist/sitemap.xml`.

## Unlisted Notes

Unlisted notes behave like unlisted YouTube videos. The permalink works (the `index.html` is still generated), but:
- `<meta name="robots" content="noindex, follow" />` is injected, so crawlers that hit the URL via backlinks won't index it.
- The slug is excluded from `dist/sitemap.xml`.
- It's filtered from the `/notes` listing UI (`Notes.jsx`).

## Sitemap

Generated at `dist/sitemap.xml` during prerender. Static routes (`/`, `/notes`, `/poker`, `/poker-analytics`) are hardcoded in `STATIC_SITEMAP_ROUTES` in `prerender.js`. Notes are appended from `getAllNotes()`, skipping `unlisted`.
