import { useMemo } from 'react';

const COLORS = {
  yellow: { bg: '#fef08a', shadow: 'rgba(202, 178, 36, 0.25)' },
  blue:   { bg: '#bae6fd', shadow: 'rgba(56, 161, 218, 0.2)' },
  green:  { bg: '#bbf7d0', shadow: 'rgba(74, 196, 123, 0.2)' },
  pink:   { bg: '#fbcfe8', shadow: 'rgba(219, 88, 157, 0.2)' },
  orange: { bg: '#fed7aa', shadow: 'rgba(219, 126, 46, 0.2)' },
};

function parseText(text) {
  const parts = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      <a key={match.index} href={match[2]} target="_blank" rel="noopener noreferrer" className="sticky-note-link">
        {match[1]}
      </a>
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default function StickyNote({ text, color = 'yellow', rotate }) {
  const deg = useMemo(() => {
    if (rotate !== undefined) return rotate;
    return (Math.random() - 0.5) * 7;
  }, [rotate]);

  const theme = COLORS[color] ?? COLORS.yellow;
  const content = parseText(text);

  return (
    <div
      className="sticky-note"
      style={{
        '--note-bg': theme.bg,
        '--note-shadow': theme.shadow,
        '--note-rotate': `${deg}deg`,
      }}
    >
      <svg className="sticky-note-pin" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <defs>
          <radialGradient id="pinGrad" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="100%" stopColor="#c0392b" />
          </radialGradient>
        </defs>
        <circle cx="7" cy="7" r="6" fill="url(#pinGrad)" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.3))" />
        <circle cx="5.5" cy="5.5" r="1.5" fill="rgba(255,255,255,0.35)" />
      </svg>
      <p className="sticky-note-text">{content}</p>
    </div>
  );
}
