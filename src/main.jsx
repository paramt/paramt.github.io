import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import '@fontsource-variable/caveat';
import '@fontsource/coming-soon';
import './index.css';
import App from './App.jsx';

const container = document.getElementById('root');
const app = <StrictMode><App /></StrictMode>;

if (container.innerHTML) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
}
