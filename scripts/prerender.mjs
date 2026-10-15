// Renders the app to static HTML inside dist/index.html (the client then
// hydrates it), preloads the hero font, inlines CSS and writes sitemap.xml.
import { readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = `${root}dist`;
const ssrDir = `${root}.ssr`;

async function inlineCss(page) {
  const re = /<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/g;
  for (const [tag, href] of [...page.matchAll(re)]) {
    const css = await readFile(`${dist}${href}`, 'utf8');
    page = page.replace(tag, () => `<style>${css}</style>`);
  }
  return page;
}

const { render } = await import(`${ssrDir}/entry-server.js`);
let html = await readFile(`${dist}/index.html`, 'utf8');

if (!html.includes('<!--app-html-->')) throw new Error('prerender: <!--app-html--> placeholder missing');
html = html.replace('<!--app-html-->', render());

// Everything above the fold is set in Geist; fetch it alongside the HTML.
const assets = await readdir(`${dist}/assets`);
const preload = assets
  .filter((f) => /^geist-latin-wght-normal.*\.woff2$/.test(f))
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin>`)
  .join('\n    ');
html = html.replace('</title>', `</title>\n    ${preload}`);

// Inline the (small) stylesheet so first paint doesn't wait on a request.
html = await inlineCss(html);

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

await rm(ssrDir, { recursive: true, force: true });
console.log(`[prerender] dist/index.html (${(html.length / 1024).toFixed(1)} kB), sitemap.xml`);
