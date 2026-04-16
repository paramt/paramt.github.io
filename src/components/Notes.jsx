import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import Nav from './Nav.jsx';

const noteModules = import.meta.glob('../data/notes/*.md', { query: '?raw', import: 'default', eager: true });

function parseFrontmatter(raw) {
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
    const slug = path.replace('../data/notes/', '').replace('.md', '');
    const { meta, content } = parseFrontmatter(raw);
    return { slug, content, title: meta.title, date: meta.date, description: meta.description };
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date));

function slugFromPath() {
  const match = window.location.pathname.match(/^\/notes\/([^/]+)\/?$/);
  return match ? match[1] : null;
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function Notes() {
  const [slug, setSlug] = useState(slugFromPath);

  useEffect(() => {
    const onPop = () => setSlug(slugFromPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  function navigate(e, newSlug) {
    e.preventDefault();
    setSlug(newSlug);
    history.pushState({}, '', newSlug ? `/notes/${newSlug}` : '/notes');
  }

  const note = slug ? notes.find(n => n.slug === slug) : null;

  return (
    <>
      <Nav />
      <main className="notes-page">
        {note ? (
          <article className="note-view">
            <a href="/notes" className="notes-back" onClick={e => navigate(e, null)}>← Notes</a>
            <h1 className="note-title">{note.title}</h1>
            <time className="note-date">{formatDate(note.date)}</time>
            <div className="note-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {note.content}
              </ReactMarkdown>
            </div>
          </article>
        ) : (
          <div className="notes-listing">
            <a href="/" className="notes-back">← Home</a>
            <ul className="notes-list">
              {notes.map(n => (
                <li key={n.slug} className="notes-list-item">
                  <a href={`/notes/${n.slug}`} className="notes-item" onClick={e => navigate(e, n.slug)}>
                    <span className="notes-item-title">{n.title}</span>
                    <time className="notes-item-date">{formatDate(n.date)}</time>
                  </a>
                  {n.description && <p className="notes-item-desc">{n.description}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  );
}
