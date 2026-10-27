# jneela.dev

Personal site of Jashwanth Neela. Static HTML rendered at build time by Vite, a few kilobytes of TypeScript for behaviour, StringTune for scroll and cursor motion, and a lazily loaded three.js scene. Deployed to GitHub Pages.

Design decisions (tokens, type scale, motion values, layout) live in [`DESIGN.md`](DESIGN.md). Change them there first.

## Edit content

All copy lives in [`src/content.ts`](src/content.ts): hero, selected work, the ledger, experience, stack, contact, and the SEO title and description. [`src/render.ts`](src/render.ts) turns it into HTML.

- No em dashes in copy.
- A work item's `stats` id must match the pub.dev package name or the Marketplace `publisher.extension` id.
- Project pictures live in `public/work/` and `public/projects/`.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # fetch stats → typecheck → build → postbuild into dist/
npm run preview    # serve dist/ at http://localhost:4173
```

`npm run build:offline` skips the stats fetch and keeps the committed snapshot.

## How it fits together

- **Render:** a Vite plugin in `vite.config.ts` calls `renderPage()` and writes the whole page into `index.html`, so the page is complete without JavaScript. `scripts/postbuild.mjs` preloads the two fonts, inlines the CSS and writes `sitemap.xml`.
- **Behaviour:** `src/main.ts` handles the theme toggle, the work pane that follows the active project, the genui_mock fixture replay, the demo video and the contact field, and starts StringTune.
- **Motion:** StringTune (`@fiddle-digital/string-tune`) is imported after first paint with native scroll kept. Split, Progress, Parallax, Magnetic, Lazy and Responsive are used; the attributes live in `render.ts` and the CSS that consumes them at the end of `site.css`. Details in `DESIGN.md`.
- **Work pane:** on desktop the work list has a sticky pane that shows each project's own output as its row reaches the middle of the screen, sized to that output. Below 1024px each project shows its output inline.
- **3D:** `src/stage3d.ts` (three.js core) loads after `load` and idle, only on desktop, with motion allowed, WebGL available and Save-Data off. It reuses the SVG's projection from `src/stack-geometry.ts`, so it lands exactly on the prerendered drawing. Add `?static` to the URL to keep the drawing.
- **Stats:** `scripts/fetch-stats.mjs` snapshots pub.dev and VS Code Marketplace numbers into `src/data/stats.json` at build time.
- **Reduced motion:** with `prefers-reduced-motion: reduce` StringTune runs only its non-motion modules; there are no splits, reveals, parallax, magnetic pull, 3D or video autoplay.

## Deploy

`.github/workflows/deploy.yml` builds and publishes `dist/` to GitHub Pages on every push to `main`, plus a weekly rebuild to refresh stats. The root `CNAME` is copied into the build.

## License

MIT
