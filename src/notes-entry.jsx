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
