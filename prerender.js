import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distClient = path.resolve(__dirname, 'dist');
const distServer = path.resolve(__dirname, 'dist-server');

const SITE_URL = 'https://www.param.me';
const OG_IMAGE = `${SITE_URL}/og-image.png`;

function gitLastMod(pathspec = '') {
  try {
    const cmd = pathspec
      ? `git log -1 --format=%cs -- ${pathspec}`
      : `git log -1 --format=%cs`;
    const out = execSync(cmd, { cwd: __dirname, encoding: 'utf-8' }).trim();
    return out || null;
  } catch {
    return null;
  }
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function buildNotesListingHead() {
  const title = 'Notes — Param Thakkar';
  const description = 'Notes, ideas, and things I figured out.';
  const url = `${SITE_URL}/notes`;
  return [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:site_name" content="Param Thakkar" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:url" content="${url}" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
  ].join('\n    ');
}

function buildNoteHead({ title, description, slug, date, unlisted }) {
  const fullTitle = `${title} — Param Thakkar`;
  const desc = description || title;
  const url = `${SITE_URL}/notes/${slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    datePublished: date,
    dateModified: date,
    author: { '@type': 'Person', name: 'Param Thakkar', url: SITE_URL },
    mainEntityOfPage: url,
    image: OG_IMAGE,
  };
  const tags = [
    `<title>${escapeHtml(fullTitle)}</title>`,
    `<meta name="description" content="${escapeHtml(desc)}" />`,
    `<link rel="canonical" href="${url}" />`,
  ];
  if (unlisted) tags.push(`<meta name="robots" content="noindex, follow" />`);
  tags.push(
    `<meta property="og:type" content="article" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(desc)}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:site_name" content="Param Thakkar" />`,
    `<meta property="article:published_time" content="${date}" />`,
    `<meta property="article:author" content="Param Thakkar" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:url" content="${url}" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(desc)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
  );
  return tags.join('\n    ');
}

function sitemapEntry({ loc, lastmod, changefreq, priority }) {
  const parts = [`    <loc>${SITE_URL}${loc}</loc>`];
  if (lastmod) parts.push(`    <lastmod>${lastmod}</lastmod>`);
  if (changefreq) parts.push(`    <changefreq>${changefreq}</changefreq>`);
  if (priority) parts.push(`    <priority>${priority}</priority>`);
  return `  <url>\n${parts.join('\n')}\n  </url>`;
}

function buildSitemap(notes) {
  const listedNotes = notes.filter((n) => !n.unlisted);
  const notesListingLastMod = listedNotes.length
    ? listedNotes.reduce((max, n) => (n.date > max ? n.date : max), listedNotes[0].date)
    : null;

  const routes = [
    { loc: '/', lastmod: gitLastMod(), priority: '1.0', changefreq: 'monthly' },
    { loc: '/notes', lastmod: notesListingLastMod, priority: '0.8', changefreq: 'weekly' },
    { loc: '/poker', priority: '0.7', changefreq: 'monthly' },
    { loc: '/poker-analytics', priority: '0.7', changefreq: 'monthly' },
    { loc: '/resume', lastmod: gitLastMod('public/resume'), priority: '0.5', changefreq: 'yearly' },
  ];

  const entries = routes.map(sitemapEntry);
  for (const n of listedNotes) {
    entries.push(sitemapEntry({
      loc: `/notes/${n.slug}`,
      lastmod: n.date,
      changefreq: 'monthly',
      priority: '0.6',
    }));
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;
}

async function prerender() {
  const { renderHome, renderNotes, getAllNotes } = await import('./dist-server/entry-server.js');

  // --- Home ---
  const homeTemplate = fs.readFileSync(path.join(distClient, 'index.html'), 'utf-8');
  let homeHtml = homeTemplate.replace('<div id="root"></div>', `<div id="root">${renderHome()}</div>`);
  try {
    const manifest = JSON.parse(
      fs.readFileSync(path.join(distClient, '.vite/manifest.json'), 'utf-8')
    );
    const heroKey = Object.keys(manifest).find((k) => k.includes('hero/3/3.webp'));
    if (heroKey) {
      const heroFile = manifest[heroKey].file;
      homeHtml = homeHtml.replace(
        '</head>',
        `  <link rel="preload" as="image" href="/${heroFile}" />\n  </head>`
      );
    }
  } catch {
    // manifest not available — fetchpriority="high" on the img still helps
  }
  fs.writeFileSync(path.join(distClient, 'index.html'), homeHtml);

  // --- Notes ---
  const notesTemplate = fs.readFileSync(path.join(distClient, 'notes.html'), 'utf-8');
  const notesDir = path.join(distClient, 'notes');
  fs.mkdirSync(notesDir, { recursive: true });

  const listingHtml = notesTemplate
    .replace('<!--ssr-head-->', buildNotesListingHead())
    .replace('<div id="root"></div>', `<div id="root">${renderNotes(null)}</div>`);
  fs.writeFileSync(path.join(notesDir, 'index.html'), listingHtml);
  console.log('  /notes');

  const notes = getAllNotes();
  for (const note of notes) {
    const html = notesTemplate
      .replace('<!--ssr-head-->', buildNoteHead(note))
      .replace('<div id="root"></div>', `<div id="root">${renderNotes(note.slug)}</div>`);
    const slugDir = path.join(notesDir, note.slug);
    fs.mkdirSync(slugDir, { recursive: true });
    fs.writeFileSync(path.join(slugDir, 'index.html'), html);
    console.log(`  /notes/${note.slug}${note.unlisted ? ' (unlisted, noindex)' : ''}`);
  }

  // --- Sitemap ---
  fs.writeFileSync(path.join(distClient, 'sitemap.xml'), buildSitemap(notes));
  console.log('  sitemap.xml');

  // --- Cleanup ---
  fs.rmSync(distServer, { recursive: true, force: true });

  console.log(`Pre-render complete: home + listing + ${notes.length} note page(s).`);
}

prerender().catch((e) => {
  console.error(e);
  process.exit(1);
});
