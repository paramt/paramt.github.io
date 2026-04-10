import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/caveat';
import '@fontsource/coming-soon';
import './index.css';
import NotFound from './components/NotFound.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode><NotFound /></StrictMode>
);
