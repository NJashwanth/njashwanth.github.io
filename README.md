# jneela.dev

Personal site of Jashwanth Neela. Vite + React + TypeScript, prerendered to static HTML and deployed to GitHub Pages.

## Edit content

All copy lives in [`src/content.ts`](src/content.ts): hero, about, experience, open source, projects, skills, contact, and the SEO title/description. Components only read from it.

- Wrap a phrase in `*asterisks*` in `about.body` to set it in italic accent.
- Open-source `id`s must match the pub.dev package name or the Marketplace `publisher.extension` id. Stats are looked up by it.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # fetch stats → typecheck → build → prerender into dist/
npm run preview    # serve dist/ at http://localhost:4173
```

`npm run build:offline` skips the stats fetch and keeps the committed snapshot.

## How it fits together

- **Prerender:** `scripts/prerender.mjs` renders the app into `dist/index.html`, inlines the CSS, preloads the display font and writes `sitemap.xml`.
- **Stats:** `scripts/fetch-stats.mjs` snapshots pub.dev and VS Code Marketplace numbers into `src/data/stats.json`. The page refreshes them live when the section scrolls near, and falls back to the snapshot.
- **Hero stack:** `StackStatic.tsx` is a prerendered CSS-3D illustration of five layers (Interface, API, Services, Data, AI Model), so the hero is never empty.
  - On desktop with WebGL, `Stack3D.tsx` (React Three Fiber + drei `RoundedBox`, `Html`) loads on first pointer or scroll intent and replaces it. A packet travels down to the model and back, and hovering a layer shows its tools.
  - Scrolling from the hero into About spreads the layers, then fades the stack out.
  - Under 768px, under reduced motion, or without WebGL, the static stack stays. Add `?static` to the URL to force it.
- **Motion:** GSAP + ScrollTrigger, with Lenis smooth scroll on GSAP's ticker, and spring easing from `src/lib/spring.ts`. All of it is gated by `prefers-reduced-motion`.

## Deploy

`.github/workflows/deploy.yml` builds and publishes `dist/` to GitHub Pages on every push to `main`, plus a weekly rebuild to refresh stats. The root `CNAME` is copied into the build.

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## License

MIT
