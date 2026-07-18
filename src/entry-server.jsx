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

export function renderNotes(slug = null, tag = null) {
  return renderToString(
    <StrictMode>
      <Notes initialSlug={slug} initialTag={tag} />
    </StrictMode>
  );
}

export { getAllNotes, getAllTags } from './data/notes-loader.js';
