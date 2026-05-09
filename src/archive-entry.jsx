import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Archive from './components/Archive.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode><Archive /></StrictMode>
);
