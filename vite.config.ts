import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { links, person, site } from './src/content.ts';

// Keep the root CNAME as the single source of truth and ship it with the
// client build so GitHub Pages keeps serving jneela.dev.
function copyCname(): Plugin {
  return {
    name: 'copy-cname',
    apply: 'build',
    writeBundle(options) {
      const src = resolve(import.meta.dirname, 'CNAME');
      if (options.dir?.endsWith('dist') && existsSync(src)) {
        copyFileSync(src, resolve(options.dir, 'CNAME'));
      }
    },
  };
}

// Fill %TOKENS% in index.html from content.ts so SEO copy lives with the rest.
function headFromContent(): Plugin {
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
  return {
    name: 'head-from-content',
    transformIndexHtml: (html) => html.replace(/%([A-Z_]+)%/g, (m, key: string) => (key in tokens ? escape(tokens[key]) : m)),
  };
}

export default defineConfig({
  plugins: [react(), copyCname(), headFromContent()],
  ssr: { noExternal: true },
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    rolldownOptions: {
      output: {
        // three, @react-three/fiber and @react-three/drei ship as one named,
        // lazily-loaded chunk ("three-[hash].js"), fetched only with the hero's 3D stack.
        codeSplitting: {
          // Keep shared deps (React) out of the group, or it gets preloaded on every page.
          includeDependenciesRecursively: false,
          groups: [{ name: 'three', test: /node_modules[\\/](three|@react-three)[\\/]/ }],
        },
      },
    },
  },
});
