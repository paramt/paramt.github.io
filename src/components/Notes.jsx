import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import Nav from './Nav.jsx';
import { getAllNotes, getNote } from '../data/notes-loader.js';

const notes = getAllNotes();

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function Notes({ initialSlug = null }) {
  const note = initialSlug ? getNote(initialSlug) : null;

  return (
    <>
      <Nav links={[]} />
      <main className="notes-page">
        {note ? (
          <article className="note-view">
            <a href="/notes" className="notes-back">← Notes</a>
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
            <h1 className="notes-heading">Notes</h1>
            <p className="notes-description">This is a place for my thoughts and musings. Ideas, reflections, or just random things I want to write down. Some will be structured, others more like a stream of consciousness. Mostly written for myself</p>
            <ul className="notes-list">
              {notes.filter(n => !n.unlisted).map(n => (
                <li key={n.slug} className="notes-list-item">
                  <a href={`/notes/${n.slug}`} className="notes-item">
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
