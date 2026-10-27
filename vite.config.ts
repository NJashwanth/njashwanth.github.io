import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin, type ViteDevServer } from 'vite';
import { links, person, site } from './src/content.ts';
import { renderPage, type Stats } from './src/render.ts';
import stats from './src/data/stats.json' with { type: 'json' };

// Keep the root CNAME as the single source of truth and ship it with the
// client build so GitHub Pages keeps serving jneela.dev.
function copyCname(): Plugin {
  return {
    name: 'copy-cname',
    apply: 'build',
    writeBundle(options) {
      const src = resolve(import.meta.dirname, 'CNAME');
      if (options.dir && existsSync(src)) copyFileSync(src, resolve(options.dir, 'CNAME'));
    },
  };
}

// Fill %TOKENS% in index.html from content.ts and render the page into
// <!--app-html-->. In dev the renderer is reloaded per request so content
// edits show without a restart.
function staticPage(): Plugin {
  const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const tokens: Record<string, string> = {
    SITE_TITLE: site.title,
    SITE_DESCRIPTION: site.description,
    SITE_URL: site.url,
    PERSON_NAME: person.name,
    PERSON_ROLE: person.role,
    LINK_GITHUB: links.github,
    LINK_LINKEDIN: links.linkedin,
  };
  let server: ViteDevServer | undefined;
  return {
    name: 'static-page',
    configureServer(s) {
      server = s;
    },
    async transformIndexHtml(html) {
      let render = renderPage;
      let data = stats as Stats;
      if (server) {
        render = (await server.ssrLoadModule('/src/render.ts')).renderPage;
        data = (await server.ssrLoadModule('/src/data/stats.json')).default;
      }
      return html
        .replace(/%([A-Z_]+)%/g, (m, key: string) => (key in tokens ? escape(tokens[key]) : m))
        .replace('<!--app-html-->', () => render(data));
    },
  };
}

export default defineConfig({
  plugins: [copyCname(), staticPage()],
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    // Only the lazily loaded 3D chunk (three.js) is this large.
    chunkSizeWarningLimit: 600,
  },
});
