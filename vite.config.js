import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// In dev, rewrite /notes/* to /notes.html so direct slug URLs work like in production
const notesDevFallback = {
  name: 'notes-dev-fallback',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url?.startsWith('/notes/')) req.url = '/notes.html';
      next();
    });
  },
};

export default defineConfig({
  plugins: [react(), notesDevFallback],
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
