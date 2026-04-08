import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distClient = path.resolve(__dirname, 'dist');
const distServer = path.resolve(__dirname, 'dist-server');

async function prerender() {
  const { render } = await import('./dist-server/entry-server.js');

  const template = fs.readFileSync(path.join(distClient, 'index.html'), 'utf-8');
  const appHtml = render();

  let html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  // Inject <link rel="preload"> for the hero image using Vite's manifest
  try {
    const manifest = JSON.parse(
      fs.readFileSync(path.join(distClient, '.vite/manifest.json'), 'utf-8')
    );
    // First polaroid is hero/3/3.webp (index 0 = Key West)
    const heroKey = Object.keys(manifest).find((k) => k.includes('hero/3/3.webp'));
    if (heroKey) {
      const heroFile = manifest[heroKey].file;
      const preload = `<link rel="preload" as="image" href="/${heroFile}" />`;
      html = html.replace('</head>', `  ${preload}\n  </head>`);
    }
  } catch {
    // manifest not available — fetchpriority="high" on the img still helps
  }

  fs.writeFileSync(path.join(distClient, 'index.html'), html);

  // Clean up server build
  fs.rmSync(distServer, { recursive: true, force: true });

  console.log('Pre-render complete.');
}

prerender().catch((e) => {
  console.error(e);
  process.exit(1);
});
