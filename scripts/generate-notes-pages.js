import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const notesDir = path.join(root, 'src', 'data', 'notes');
const distDir = path.join(root, 'dist');
const sourceHtml = path.join(distDir, 'notes.html');

if (!fs.existsSync(sourceHtml)) {
  console.error('dist/notes.html not found — run vite build first');
  process.exit(1);
}

const html = fs.readFileSync(sourceHtml, 'utf8');

// dist/notes/index.html — serves /notes/ (trailing slash)
const notesIndexDir = path.join(distDir, 'notes');
fs.mkdirSync(notesIndexDir, { recursive: true });
fs.writeFileSync(path.join(notesIndexDir, 'index.html'), html);

// dist/notes/[slug]/index.html — one per note
const slugs = fs.readdirSync(notesDir)
  .filter(f => f.endsWith('.md'))
  .map(f => f.replace('.md', ''));

for (const slug of slugs) {
  const slugDir = path.join(notesIndexDir, slug);
  fs.mkdirSync(slugDir, { recursive: true });
  fs.writeFileSync(path.join(slugDir, 'index.html'), html);
  console.log(`  /notes/${slug}`);
}

console.log(`Generated notes pages: index + ${slugs.length} post(s)`);
