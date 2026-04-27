import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import Notes from './components/Notes.jsx';

export function renderHome() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

export function renderNotes(slug = null) {
  return renderToString(
    <StrictMode>
      <Notes initialSlug={slug} />
    </StrictMode>
  );
}

export { getAllNotes } from './data/notes-loader.js';
