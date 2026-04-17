import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { resolve, dirname, join } from 'path'
import { existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Dev: rewrite /notes/* to /notes.html so direct slug URLs work like in production.
// Preview: rewrite /notes and /notes/<slug> to the prerendered dist/notes/.../index.html
// so it resolves the way GitHub Pages does (vite preview doesn't auto-resolve
// extensionless directory paths — falls back to SPA index.html instead).
const notesServerShim = {
  name: 'notes-server-shim',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url?.startsWith('/notes/')) req.url = '/notes.html';
      next();
    });
  },
  configurePreviewServer(server) {
    const dist = resolve(__dirname, 'dist');
    server.middlewares.use((req, _res, next) => {
      const url = req.url?.split('?')[0];
      if (url && /^\/notes(\/[^/]+)?\/?$/.test(url)) {
        const clean = url.replace(/\/$/, '');
        const candidate = join(dist, clean, 'index.html');
        if (existsSync(candidate)) req.url = `${clean}/index.html`;
      }
      next();
    });
  },
};

export default defineConfig({
  plugins: [react(), notesServerShim],
  base: '/',
  build: {
    manifest: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        '404': resolve(__dirname, '404.html'),
        notes: resolve(__dirname, 'notes.html'),
      },
    },
  },
})
