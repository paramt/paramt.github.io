import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import Nav from './Nav.jsx';
import { getAllNotes, getNote } from '../data/notes-loader.js';

const notes = getAllNotes();

function slugFromLocation() {
  const match = window.location.pathname.match(/^\/notes\/([^/]+)\/?$/);
  return match ? match[1] : null;
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function Notes({ initialSlug = null }) {
  const [slug, setSlug] = useState(initialSlug);

  useEffect(() => {
    const onPop = () => setSlug(slugFromLocation());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  function navigate(e, newSlug) {
    e.preventDefault();
    setSlug(newSlug);
    history.pushState({}, '', newSlug ? `/notes/${newSlug}` : '/notes');
  }

  const note = slug ? getNote(slug) : null;

  return (
    <>
      <Nav />
      <main className="notes-page">
        {note ? (
          <article className="note-view">
            <a href="/notes" className="notes-back" onClick={e => navigate(e, null)}>← Notes</a>
            <h1 className="note-title">{note.title}</h1>
            <time className="note-date" dateTime={note.date}>{formatDate(note.date)}</time>
            {note.description && <p className="note-description">{note.description}</p>}
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
              {notes.filter(n => !n.unlisted).map(n => (
                <li key={n.slug} className="notes-list-item">
                  <a href={`/notes/${n.slug}`} className="notes-item" onClick={e => navigate(e, n.slug)}>
                    <span className="notes-item-title">{n.title}</span>
                    <time className="notes-item-date" dateTime={n.date}>{formatDate(n.date)}</time>
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
