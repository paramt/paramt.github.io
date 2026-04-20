const noteModules = import.meta.glob('./notes/*.md', { query: '?raw', import: 'default', eager: true });
const noteAssetModules = import.meta.glob([
  './notes/**/*.png',
  './notes/**/*.jpg',
  './notes/**/*.jpeg',
  './notes/**/*.webp',
  './notes/**/*.gif',
  './notes/**/*.avif',
  './notes/**/*.svg',
]);
const noteAssetPaths = Object.keys(noteAssetModules);

const OBSIDIAN_IMAGE_RE = /!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

function isExternalUrl(src) {
  return /^(?:[a-z]+:)?\/\//i.test(src) || src.startsWith('data:') || src.startsWith('#');
}

function normalizeNoteAssetPath(src) {
  if (!src) return src;
  return decodeURIComponent(src.trim())
    .replace(/^\.\/+/, '')
    .replace(/^\/+/, '')
    .split('?')[0]
    .split('#')[0];
}

function encodeNoteMediaPath(path) {
  return path.split('/').map(encodeURIComponent).join('/');
}

function resolveNoteAssetPath(src) {
  const normalized = normalizeNoteAssetPath(src);
  if (!normalized) return null;

  const directMatch = `./notes/${normalized}`;
  if (noteAssetPaths.includes(directMatch)) return normalized;

  const fileName = normalized.split('/').pop();
  const basenameMatch = noteAssetPaths.find((path) => path.endsWith(`/${fileName}`));
  return basenameMatch ? basenameMatch.replace('./notes/', '') : normalized;
}

export function resolveNoteAsset(src) {
  if (!src || isExternalUrl(src)) return src;
  if (src.startsWith('/')) return encodeURI(src);
  const resolvedPath = resolveNoteAssetPath(src);
  return resolvedPath ? `/notes-media/${encodeNoteMediaPath(resolvedPath)}` : src;
}

function obsidianImageToMarkdown(_, rawTarget, rawAlt) {
  const target = resolveNoteAsset(rawTarget);
  const fallbackAlt = normalizeNoteAssetPath(rawTarget)?.split('/').pop() ?? '';
  const alt = (rawAlt ?? fallbackAlt).replace(/[[\]]/g, '');
  return `![${alt}](${target})`;
}

function normalizeNoteContent(content) {
  return content.replace(OBSIDIAN_IMAGE_RE, obsidianImageToMarkdown);
}

export function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw };
  const meta = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(': ');
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 2).trim();
  }
  return { meta, content: match[2] };
}

const notes = Object.entries(noteModules)
  .map(([path, raw]) => {
    const slug = path.replace('./notes/', '').replace('.md', '');
    const { meta, content } = parseFrontmatter(raw);
    return {
      slug,
      content: normalizeNoteContent(content),
      title: meta.title,
      date: meta.date,
      description: meta.description,
      unlisted: meta.unlisted === 'true',
    };
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date));

export function getAllNotes() {
  return notes;
}

export function getNote(slug) {
  return notes.find((n) => n.slug === slug) ?? null;
}
