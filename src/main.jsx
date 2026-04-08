import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

const container = document.getElementById('root');
const app = <StrictMode><App /></StrictMode>;

if (container.innerHTML) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
