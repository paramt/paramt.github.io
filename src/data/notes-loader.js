const noteModules = import.meta.glob('./notes/*.md', { query: '?raw', import: 'default', eager: true });

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
      content,
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
