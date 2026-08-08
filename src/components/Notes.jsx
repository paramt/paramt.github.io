import { useEffect, useState } from 'react';
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

// The highlight target preceding a footnote ref: a trailing quoted phrase,
// or the trailing word — hyphens/apostrophes are word-internal so compounds
// like "state-of-the-art" highlight whole. Surrounding punctuation is split
// off into `before`/`trail` rather than highlighted.
function splitTrailingPhrase(value) {
  const quoted = value.match(/["“][^"“”]*["”]$/);
  if (quoted) {
    return { before: value.slice(0, -quoted[0].length), phrase: quoted[0], trail: '' };
  }
  const token = value.match(/\S+$/)?.[0];
  if (!token) return { phrase: null };
  const lead = token.match(/^[^\p{L}\p{N}]*/u)[0];
  const trail = token.match(/[^\p{L}\p{N}]*$/u)[0];
  const phrase = token.slice(lead.length, token.length - trail.length);
  if (!phrase) return { phrase: null };
  return { before: value.slice(0, value.length - token.length) + lead, phrase, trail };
}

const FNHL_INLINE_TAGS = new Set(['em', 'strong', 'code', 'a']);

function fnhlSpan(children) {
  return { type: 'element', tagName: 'span', properties: { className: ['note-fnhl'] }, children };
}

// Rich mode only: wraps each footnote ref (sup > a[data-footnote-ref]) together
// with the word/phrase/inline-element before it in a .note-fnhl span — one
// hover target for the footnote popup, highlighted as a whole (footnote number
// included). Runs before rehypeKatex so preceding text is still plain.
function rehypeFootnoteHighlights() {
  return (tree) => {
    const refs = [];
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'sup' || !parent) return;
      const link = node.children?.[0];
      if (link?.tagName === 'a' && link.properties?.dataFootnoteRef) refs.push({ node, index, parent });
    });
    // Reverse order so splices don't invalidate earlier collected indexes.
    for (const { node, index, parent } of refs.reverse()) {
      const prev = parent.children[index - 1];
      if (prev?.type === 'element' && FNHL_INLINE_TAGS.has(prev.tagName)) {
        parent.children.splice(index - 1, 2, fnhlSpan([prev, node]));
        continue;
      }
      const wrapChildren = [node];
      let start = index;
      let removed = 1;
      if (prev?.type === 'text') {
        const { before, phrase, trail } = splitTrailingPhrase(prev.value);
        if (phrase) {
          wrapChildren.unshift({ type: 'text', value: phrase });
          if (trail) wrapChildren.splice(1, 0, { type: 'text', value: trail });
          if (before) {
            prev.value = before;
          } else {
            start = index - 1;
            removed = 2;
          }
        }
      }
      parent.children.splice(start, removed, fnhlSpan(wrapChildren));
    }
  };
}

// Mirrors rehypeHeadingSlugs (same slugify + dedup counter) so TOC anchors
// match the ids assigned to rendered headings. Fenced code is stripped so a
// `# comment` line inside a code block isn't picked up as a heading.
function extractHeadings(content) {
  const seen = new Map();
  const headings = [];
  for (const line of content.replace(/```[\s\S]*?```/g, '').split('\n')) {
    const match = line.match(/^(#{1,2})\s+(.+)/);
    if (!match) continue;
    const text = match[2]
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[*_`~]/g, '')
      .replace(/--/g, '—')
      .replace(/->/g, '→')
      .trim();
    let slug = slugify(text);
    const count = seen.get(slug) ?? 0;
    seen.set(slug, count + 1);
    if (count > 0) slug = `${slug}-${count}`;
    headings.push({ level: match[1].length, text, id: slug });
  }
  return headings;
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
import { getAllNotes, getNote, getAllTags, resolveNoteAsset } from '../data/notes-loader.js';

const notes = getAllNotes();
const tagGroups = getAllTags();
const listedNotes = notes.filter(n => !n.unlisted);

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function Notes({ initialSlug = null, initialTag = null }) {
  const isTagsPage = initialSlug === 'tags';
  const tagGroup = initialTag ? tagGroups.find(g => g.tag === initialTag) : null;
  const note = !isTagsPage && !initialTag && initialSlug ? getNote(initialSlug) : null;
  const tocHeadings = note?.rich ? extractHeadings(note.content) : [];
  const [footnotePopup, setFootnotePopup] = useState(null);

  // Rich mode: hovering a .note-fnhl shows its footnote in a fixed box at the
  // bottom of the TOC column. It persists on unhover until the page scrolls or
  // another footnote is hovered.
  useEffect(() => {
    if (!note?.rich) return;
    const content = document.querySelector('.note-content');
    if (!content) return;

    function handleMouseOver(e) {
      const wrap = e.target.closest?.('.note-fnhl');
      if (!wrap) return;
      const ref = wrap.querySelector('a[data-footnote-ref]');
      const href = ref?.getAttribute('href');
      if (!href?.startsWith('#')) return;
      const def = document.getElementById(decodeURIComponent(href.slice(1)));
      if (!def) return;
      const clone = def.cloneNode(true);
      clone.querySelectorAll('a[data-footnote-backref]').forEach(a => a.remove());
      setFootnotePopup({ num: ref.textContent, html: clone.innerHTML });
    }
    function handleScroll() {
      setFootnotePopup(null);
    }

    content.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      content.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [note]);

  // j/k navigate to the next/previous note, in the same order as the /notes
  // listing. Only listed notes participate, so this can't be used to browse
  // into unlisted content from a listed note.
  useEffect(() => {
    if (!note) return;
    const idx = listedNotes.findIndex(n => n.slug === note.slug);
    if (idx === -1) return;

    function handleKeyDown(e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable) return;
      if (e.key === 'j' && idx < listedNotes.length - 1) {
        window.location.href = `/notes/${listedNotes[idx + 1].slug}`;
      } else if (e.key === 'k' && idx > 0) {
        window.location.href = `/notes/${listedNotes[idx - 1].slug}`;
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [note]);

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
      <main className={note?.rich ? 'notes-page notes-page--rich' : 'notes-page'}>
        {note ? (
          <article className="note-view">
            {tocHeadings.length > 0 && (
              <nav className="note-toc" aria-label="Table of contents">
                <ul>
                  {tocHeadings.map(h => (
                    <li key={h.id} className={h.level === 2 ? 'note-toc-sub' : undefined}>
                      <a href={`#${h.id}`}>{h.text}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            <a href="/notes" className="notes-back">← Notes</a>
            <h1 className="note-title">{note.title}</h1>
            <div className="note-meta">
              {note.date && <time className="note-date" dateTime={note.date}>{formatDate(note.date)}</time>}
              {note.unlisted && <span className="notes-tag notes-tag--unlisted">unlisted</span>}
              {note.tags.map(tag => (
                <a key={tag} href={`/notes/tags/${tag}`} className={`notes-tag notes-tag--${tag}`}>{tag}</a>
              ))}
            </div>
            {note.description && <p className="note-description">{note.description}</p>}
            <div className="note-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath, remarkEmDash]}
                rehypePlugins={note.rich
                  ? [rehypeHeadingSlugs, rehypeFootnoteIds, rehypeFootnoteHighlights, rehypeKatex]
                  : [rehypeHeadingSlugs, rehypeFootnoteIds, rehypeKatex]}
                components={markdownComponents}
              >
                {note.content}
              </ReactMarkdown>
            </div>
            {footnotePopup && (
              <aside className="note-footnote-popup">
                <span className="note-footnote-popup-num">{footnotePopup.num}</span>
                <div dangerouslySetInnerHTML={{ __html: footnotePopup.html }} />
              </aside>
            )}
          </article>
        ) : tagGroup ? (
          <div className="notes-listing">
            <a href="/notes/tags" className="notes-back">← Tags</a>
            <h1 className="notes-heading">
              <span className={`notes-tag notes-tag--${tagGroup.tag}`}>{tagGroup.tag}</span>
            </h1>
            <ul className="notes-list">
              {tagGroup.notes.map(n => (
                <li key={n.slug} className="notes-list-item">
                  <a href={`/notes/${n.slug}`} className="notes-item">
                    <span className="notes-item-title">{n.title}</span>
                    {n.date && <time className="notes-item-date" dateTime={n.date}>{formatDate(n.date)}</time>}
                  </a>
                  {n.description && <p className="notes-item-desc">{n.description}</p>}
                </li>
              ))}
            </ul>
          </div>
        ) : isTagsPage ? (
          <div className="notes-listing">
            <a href="/notes" className="notes-back">← Notes</a>
            <h1 className="notes-heading">Tags</h1>
            {tagGroups.map(({ tag, notes: taggedNotes }) => (
              <section key={tag} id={tag} className="tag-group">
                <h2 className="tag-group-heading">
                  <a href={`/notes/tags/${tag}`} className={`notes-tag notes-tag--${tag}`}>{tag}</a>
                </h2>
                <ul className="notes-list">
                  {taggedNotes.map(n => (
                    <li key={n.slug} className="notes-list-item">
                      <a href={`/notes/${n.slug}`} className="notes-item">
                        <span className="notes-item-title">{n.title}</span>
                        {n.date && <time className="notes-item-date" dateTime={n.date}>{formatDate(n.date)}</time>}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <div className="notes-listing">
            <a href="/" className="notes-back">← Home</a>
            <h1 className="notes-heading">Notes</h1>
            <p className="notes-description">This is a place for my thoughts and musings. Ideas, reflections, or just random things I want to write down. Some will be structured, others more like a stream of consciousness, but mostly written as notes for myself. <a href="/notes/tags">Browse by tag →</a></p>
            <ul className="notes-list">
              {listedNotes.map(n => {
              let isNew = false;
              if (n.date) {
                const [y, m, d] = n.date.split('-').map(Number);
                isNew = (Date.now() - new Date(y, m - 1, d).getTime()) < 7 * 24 * 60 * 60 * 1000;
              }
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
                    {n.date && <time className="notes-item-date" dateTime={n.date}>{formatDate(n.date)}</time>}
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
