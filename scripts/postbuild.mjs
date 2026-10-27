// After `vite build`: preload the two fonts the first screen is set in,
// inline the (small) stylesheet so first paint doesn't wait on a request,
// and write sitemap.xml.
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist', import.meta.url));
let html = await readFile(`${dist}/index.html`, 'utf8');

const assets = await readdir(`${dist}/assets`);
const fonts = assets.filter((f) => /^(young-serif-latin-400-normal|source-serif-4-latin-wght-normal).*\.woff2$/.test(f));
if (fonts.length !== 2) throw new Error(`postbuild: expected 2 fonts to preload, found ${fonts.join(', ') || 'none'}`);
const preload = fonts.map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin>`).join('\n    ');
html = html.replace('</title>', `</title>\n    ${preload}`);

const re = /<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/g;
for (const [tag, href] of [...html.matchAll(re)]) {
  const css = await readFile(`${dist}${href}`, 'utf8');
  html = html.replace(tag, () => `<style>${css}</style>`);
}

await writeFile(`${dist}/index.html`, html);

const today = new Date().toISOString().slice(0, 10);
await writeFile(
  `${dist}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://jneela.dev/</loc><lastmod>${today}</lastmod><priority>1.0</priority></url>
</urlset>
`,
);
console.log(`[postbuild] dist/index.html (${(html.length / 1024).toFixed(1)} kB), sitemap.xml`);
