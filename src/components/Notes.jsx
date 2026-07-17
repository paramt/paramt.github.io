import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { visit } from 'unist-util-visit';

function remarkEmDash() {
  return (tree) => {
    function walk(node) {
      if (node.type === 'text') node.value = node.value.replace(/--/g, '—').replace(/->/g, '→');
      if (node.children) node.children.forEach(walk);
    }
    walk(tree);
  };
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// remark-gfm's footnote backref id/href default to user-content-fnref-N
// (the user-content- prefix guards against DOM clobbering); rename to
// footnote-N. Leaves the fn-N footnote-definition id/href untouched.
function rehypeFootnoteIds() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const { id, href } = node.properties ?? {};
      if (typeof id === 'string' && id.startsWith('user-content-fnref-')) {
        node.properties.id = id.replace('user-content-fnref-', 'footnote-');
      }
      if (typeof href === 'string' && href.startsWith('#user-content-fnref-')) {
        node.properties.href = href.replace('#user-content-fnref-', '#footnote-');
      }
    });
  };
}

// Assigns slug ids to h1/h2 headings; runs before rehypeKatex so heading text
// is read before math nodes are expanded into KaTeX's verbose markup.
function rehypeHeadingSlugs() {
  return (tree) => {
    const seen = new Map();
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'h1' && node.tagName !== 'h2') return;
      let text = '';
      visit(node, 'text', (textNode) => { text += textNode.value; });
      let slug = slugify(text);
      const count = seen.get(slug) ?? 0;
      seen.set(slug, count + 1);
      if (count > 0) slug = `${slug}-${count}`;
      node.properties = { ...node.properties, id: slug };
    });
  };
}

function HeadingAnchor({ id, symbol }) {
  return (
    <a href={`#${id}`} className="note-heading-anchor" aria-label="Link to this heading">{symbol}</a>
  );
}

function NoteH1({ node: _node, children, ...props }) {
  return (
    <h1 {...props}>
      <HeadingAnchor id={props.id} symbol="#" />
      {children}
    </h1>
  );
}

function NoteH2({ node: _node, children, ...props }) {
  return (
    <h2 {...props}>
      <HeadingAnchor id={props.id} symbol="##" />
      {children}
    </h2>
  );
}
import 'katex/dist/katex.min.css';
import Nav from './Nav.jsx';
import { getAllNotes, getNote, resolveNoteAsset } from '../data/notes-loader.js';

const notes = getAllNotes();

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function Notes({ initialSlug = null }) {
  const note = initialSlug ? getNote(initialSlug) : null;
  const markdownComponents = note
    ? {
        img({ node: _node, src, alt, ...props }) {
          return <img {...props} src={resolveNoteAsset(src)} alt={alt ?? ''} loading="lazy" />;
        },
        h1: NoteH1,
        h2: NoteH2,
      }
    : undefined;

  return (
    <>
      <Nav links={[]} />
      <main className="notes-page">
        {note ? (
          <article className="note-view">
            <a href="/notes" className="notes-back">← Notes</a>
            <h1 className="note-title">{note.title}</h1>
            <div className="note-meta">
              {note.date && <time className="note-date" dateTime={note.date}>{formatDate(note.date)}</time>}
              {note.unlisted && <span className="notes-tag notes-tag--unlisted">unlisted</span>}
              {note.tags.map(tag => (
                <span key={tag} className={`notes-tag notes-tag--${tag}`}>{tag}</span>
              ))}
            </div>
            {note.description && <p className="note-description">{note.description}</p>}
            <div className="note-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath, remarkEmDash]}
                rehypePlugins={[rehypeHeadingSlugs, rehypeFootnoteIds, rehypeKatex]}
                components={markdownComponents}
              >
                {note.content}
              </ReactMarkdown>
            </div>
          </article>
        ) : (
          <div className="notes-listing">
            <a href="/" className="notes-back">← Home</a>
            <h1 className="notes-heading">Notes</h1>
            <p className="notes-description">This is a place for my thoughts and musings. Ideas, reflections, or just random things I want to write down. Some will be structured, others more like a stream of consciousness, but mostly written as notes for myself.</p>
            <ul className="notes-list">
              {notes.filter(n => !n.unlisted).map(n => {
              const [y, m, d] = n.date.split('-').map(Number);
              const isNew = (Date.now() - new Date(y, m - 1, d).getTime()) < 7 * 24 * 60 * 60 * 1000;
              return (
                <li key={n.slug} className="notes-list-item">
                  <a href={`/notes/${n.slug}`} className="notes-item">
                    <span className="notes-item-title">
                      {n.title}
                      {isNew && <span className="notes-tag notes-tag--new">new</span>}
                      {n.tags.map(tag => (
                        <span key={tag} className={`notes-tag notes-tag--${tag}`}>{tag}</span>
                      ))}
                    </span>
                    <time className="notes-item-date" dateTime={n.date}>{formatDate(n.date)}</time>
                  </a>
                  {n.description && <p className="notes-item-desc">{n.description}</p>}
                </li>
              );
            })}
            </ul>
          </div>
        )}
      </main>
    </>
  );
}
