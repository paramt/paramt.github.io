import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/caveat';
import '@fontsource/coming-soon';
import './index.css';
import Notes from './components/Notes.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode><Notes /></StrictMode>
);
