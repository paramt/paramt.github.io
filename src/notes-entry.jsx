import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import '@fontsource-variable/caveat';
import '@fontsource/coming-soon';
import './index.css';
import Notes from './components/Notes.jsx';

const tagMatch = window.location.pathname.match(/^\/notes\/tags\/([^/]+)\/?$/);
const noteMatch = window.location.pathname.match(/^\/notes\/([^/]+)\/?$/);
const initialTag = tagMatch ? decodeURIComponent(tagMatch[1]) : null;
const initialSlug = !initialTag && noteMatch ? noteMatch[1] : null;

const container = document.getElementById('root');
const app = <StrictMode><Notes initialSlug={initialSlug} initialTag={initialTag} /></StrictMode>;

if (container.innerHTML) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}

// Re-apply a #fragment deep link once the page has loaded. The browser's own
// load-time jump is animated (html { scroll-behavior: smooth }) and can be
// dropped or start before layout settles, so a link like
// /notes/<slug>/#user-content-fn-1 could leave the reader at the top.
if (window.location.hash) {
  const jump = () => {
    let target;
    try { target = document.getElementById(decodeURIComponent(window.location.hash.slice(1))); } catch { return; }
    target?.scrollIntoView({ behavior: 'instant', block: 'start' });
  };
  if (document.readyState === 'complete') requestAnimationFrame(jump);
  else window.addEventListener('load', () => requestAnimationFrame(jump), { once: true });
}
