import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import '@fontsource-variable/caveat';
import '@fontsource/coming-soon';
import './index.css';
import Notes from './components/Notes.jsx';

const match = window.location.pathname.match(/^\/notes\/([^/]+)\/?$/);
const initialSlug = match ? match[1] : null;

const container = document.getElementById('root');
const app = <StrictMode><Notes initialSlug={initialSlug} /></StrictMode>;

if (container.innerHTML) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
