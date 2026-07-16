#!/usr/bin/env node
// Syncs the notes vault from the sibling ../notes repo into src/data/notes,
// which is the source Vite reads at dev/build time (see notes-loader.js).
// The notes repo is the source of truth; src/data/notes here is a disposable,
// gitignored copy regenerated on every dev/build (see predev/prebuild in package.json).

import { cpSync, existsSync, rmSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const source = join(root, '..', 'notes');
const dest = join(root, 'src/data/notes');

if (!existsSync(source)) {
  console.error(`Error: notes source repo not found at ${source}`);
  console.error('Expected a sibling "notes" repo checked out next to this one.');
  process.exit(1);
}

const EXCLUDE = new Set(['.git', '.obsidian', 'templates', '.DS_Store', '.gitignore']);

rmSync(dest, { recursive: true, force: true });
cpSync(source, dest, {
  recursive: true,
  filter: (src) => !EXCLUDE.has(src.split('/').pop()),
});

console.log(`Synced notes from ${source} to ${dest}`);
