import { useState, useEffect } from 'react';

function getEffectiveIsDark() {
  const theme = document.documentElement.getAttribute('data-theme');
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export default function Nav() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) document.documentElement.setAttribute('data-theme', stored);
    setIsDark(getEffectiveIsDark());
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  const links = [
    { href: "/#projects", label: "Projects" },
    { href: "/#timeline", label: "Timeline" },
    { href: "/notes", label: "Notes" },
  ];

  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="/" className="nav-name">param.me</a>
        <div className="nav-links">
          {links.map(({ href, label }) => (
            <a key={href} href={href}>{label}</a>
          ))}
          <button onClick={toggle} className="theme-toggle" aria-label="Toggle dark mode">
            {isDark
              ? <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
              : <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            }
          </button>
        </div>
      </div>
    </nav>
  );
}
