# jneela.dev design spec

The fixed reference for this site. Tokens, the type scale and motion values below are locked:
change them here first, with approval, never ad hoc in a component.

Direction: tasteskill "The split stage" (seed 1096797707), type "Young Serif / Source Serif 4",
palette "Ink and Rust" (replacing the dealt "Stone and blueprint").

## Idea

On this page, **the real output of Jashwanth's tools** (a recorded GenUI fixture, a proxy that
counts tokens, a mock server's route file, a widget shattering) **becomes the sheet laid on a fixed
stage**. The stage opens on the layered stack he works across (interface, API, services, data,
model) in 3D, then swaps to each project's own output as its row reaches the middle of the screen.

Live thing: the genui_mock sheet has a **Replay** button that streams the three chunks of the
README's real fixture at their recorded delays (0, 300, 400 ms) and renders the surface they
describe. Without JS the fixture and its rendered result are both shown statically.

## Argument (one claim per section)

| Section | Claim | Proof |
| --- | --- | --- |
| Hero | Full stack engineer moving into AI, builds products end to end | Name, role line, the stack in 3D, Email/GitHub/LinkedIn |
| Selected work | He ships tools other engineers install, several of them for AI work | 8 projects, each with its real output on the stage and registry numbers |
| Also shipped | The rest of the public work, all of it | Ledger of 7 more repos and packages |
| Experience | Seven roles since 2018, founding engineer to senior engineer | Company, title, dates, two lines each |
| Stack | Breadth across AI, frontend, backend, cloud, mobile | Grouped lists set in large type |
| Contact | Easy to reach | One message field that opens email, plus direct links |

Writing/Notes is omitted: no published writing exists yet.

## Colour tokens

Palette: Ink and Rust. These are the only colour values in the stylesheet; everything else is a
token or a `color-mix()` of tokens. The two `theme-color` meta tags repeat the `--bg` values.

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--bg` | `#EDE8E0` | `#171411` | page ground |
| `--surface` | `#E3DCD1` | `#221E1A` | work pane, code blocks and cards, Stack band, picture frames |
| `--line` | `#D3CABD` | `#332D27` | card edges and dividers |
| `--text` | `#1F1B16` | `#EDE6DA` | body text, headings, links |
| `--muted` | `#5F5345` | `#A39684` | secondary text, metadata, dates |
| `--accent` | `#B4532A` | `#E07A45` | primary button, link underlines, focus rings, selection, the 3D request |
| `--on-accent` | `#FBF6EF` | `#171411` | text on the accent |
| `--accent-text` | `#9C451F` | `#E8895A` | small accent labels (stack group names) |
| `--band` | `#B4532A` | `#E07A45` | the Contact and footer band |
| `--on-band` | `#FBF6EF` | `#171411` | all text, links, field border and focus rings on the band |
| `--layer-top/left/right` | `#F5F1EB` `#D6CEC2` `#BFB5A7` | `#2E2924` `#221E1A` `#1A1714` | stack faces at rest |
| `--hi-top/left/right` | `#B4532A` `#8E3F1E` `#7A3519` | `#E07A45` `#B65F33` `#9A4F2A` | stack faces at full accent |

The hero stack is a ramp: `--ramp-N-{top,left,right}` mixes each layer face toward its hi colour in
sRGB by 14% (Interface), 32% (API), 50% (Services), 70% (Data) and 100% (Model). The 3D scene reads
the SVG's computed fills, so it follows the ramp and the theme without colours of its own.

Theme: follows the OS; a toggle stores `light`/`dark` in localStorage and sets `html[data-theme]`.
Dark values are defined under `@media (prefers-color-scheme: dark)` on `:root:not([data-theme="light"])`
and again on `:root[data-theme="dark"]`.

## Type

- Display and headings: **Young Serif** 400, tracking -0.02em, leading 0.95.
- Text: **Source Serif 4** (variable), 400 body, 600 emphasis, leading 1.55.
- Code inside interface fragments (`[data-ui]`) only: system monospace stack.
- Self-hosted woff2 (latin subset) via Fontsource; both preloaded.

Five steps, nothing else:

| Token | Value | Use |
| --- | --- | --- |
| `--step-small` | `clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)` | meta, figures, footer (13–14px) |
| `--step-body` | `clamp(1.125rem, 1.05rem + 0.3vw, 1.3125rem)` | running text, nav, buttons (18–21px) |
| `--step-lead` | `clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem)` | role line, row names, stack lists (20–26px) |
| `--step-head` | `clamp(2rem, 1.4rem + 1.6vw, 2.75rem)` | section headings (32–44px) |
| `--step-display` | `clamp(3rem, 1rem + 7.2vw, 9.5rem)` | the name, hero and footer (one line) |

## Space and frame

- 4px base. `--space-1..10`: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- One centred container: `--container` 97.5rem (1560px), `.wrap` = `min(100% - 2 * --margin, --container)`.
- Side gutter `--margin`: `clamp(1rem, 4vw, 4rem)` (16px phone, 64px wide), plus safe-area insets.
- 12-column grid inside the container, column gap `--gap`: `clamp(1rem, 2vw, 2rem)`.
- Section gap `--section`: `clamp(4.5rem, 3rem + 4vw, 7.5rem)` (72px phone, 120px maximum).
- Prose measure 62ch, always paired with something in the neighbouring columns.
- Radius: 0 everywhere. Buttons square, 48px tall. Primary button filled `--accent`; secondary
  button a 1px `--text` outline on transparent. No shadows, no gradients.

## Layout

- **Header:** wordmark left, four links and the theme toggle right; on phones the links wrap to a second row.
- **Hero (≥1024px):** the stack panel in columns 1-6 (6:5), and one composed block in columns 7-12: the
  name on two lines sized to its column (`17.5cqi`), the role, the intro at `--step-lead`, the actions.
  No forced viewport height. Below 1024px the panel (16:9 tablet, 4:3 phone) sits above the block.
- **Section heads:** title in columns 1-5, the supporting sentence in columns 6-12.
- **Work (≥1024px):** a sticky pane in columns 1-5 that is exactly as tall as the sheet it shows
  (capped at the viewport), the list in columns 6-12. Each entry is text plus a meta column
  (type, registry figures, version). 48px between entries. Below 1024px each sheet sits inline.
- **Also shipped:** full-width rows on the 12-column grid (name 1-3, description 4-9, figure 10-11, year 12).
- **Experience:** date 1-2, company and role 3-5, summary 6-12 on one row.
- **Stack:** five columns on desktop, balanced CSS columns below.
- **Contact:** prompt and field in columns 1-6, links in 8-12; the name closes at full container width.

## 3D concept

Five flat slabs (Interface, API, Services, Data, Model) under an orthographic camera at an
isometric angle, drawn in the page's own tones: top faces `--paper`, sides `--surface`, edges
`--ink` at low opacity. One `--accent` cube (the request) travels down to Model and back up,
pausing at each layer; the layer it touches tints toward the accent. Pointer over the panel turns
the stack up to ±8° with damping; scrolling the hero away opens the layers apart. Labels are HTML beside the slabs.

- three.js core only, dynamically imported after `load` + idle, only when width ≥1024px, WebGL
  exists, motion is allowed and Save-Data is off. Otherwise the prerendered SVG drawing stays.
- Renders only while the panel is on screen and the tab is visible. DPR capped at 2.
- Re-reads colour tokens when the theme changes.

## Motion (locked values)

```css
--ease-out: cubic-bezier(0.22, 1, 0.36, 1);
--ease-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.76, 0, 0.24, 1);
--t-press: 140ms;  --t-hover: 180ms;  --t-ui: 240ms;  --t-stage: 300ms;
--t-reveal: 800ms; --stagger-item: 70ms;
```

Scroll and cursor motion runs on StringTune (`@fiddle-digital/string-tune` 1.2.7), loaded after first
paint. Native scroll is kept (`scrollDesktopMode = 'default'`), so anchors and keyboard scrolling are untouched.

- **StringSplit:** hero name splits into characters that rise out of their lines (80ms + 120ms per
  line + 24ms per character, 900ms, `--ease-expo`; desktop with a mouse only, held at most 1.6s).
  Section headings split into words that rise once in view (80ms per word, 900ms).
- **StringProgress:** project entries and experience rows are scroll-linked: `--progress` runs 0 to 1
  from the moment an entry's top meets the viewport bottom until it is 22% of the viewport inside;
  opacity follows it and the entry rises 28px. The hero's progress opens the 3D layers apart (up to 45%).
  Section intros, ledger rows and stack groups reveal once on `-inview` (700ms opacity, 900ms rise of 20px).
- **StringParallax:** the SVG stack's layers drift at -0.04 per layer (`parallax[]`, all scroll modes).
- **StringMagnetic:** the Email Me button (strength 0.25, radius 110) and the contact send button
  (0.3, 90), on the `translate` property.
- **StringLazy:** every project picture, with a `<noscript>` fallback and an IntersectionObserver backstop.
- **StringResponsive:** writes `data-screen` (mobile under 768, tablet to 1023, laptop to 1439, desktop);
  parallax is neutralised on mobile and tablet, and parallax and magnetic register only with a mouse at 1024px+.
- Stage swap: sheets crossfade over `--t-stage`, incoming rises 8px. Footer name scales 0.94 to 1 on a
  CSS scroll timeline.
- `prefers-reduced-motion: reduce`: StringTune runs only Lazy, Responsive and Progress (which moves nothing
  without `html.st-motion`); no split, no parallax, no magnetic, no 3D, no autoplay.
- Developer overlays (StringDevInview, StringDevLayout) need an early-access token and are not used.

## Copy rules

No em dashes anywhere. Curly quotes and `…`. Numbers from the registries only (build snapshot).
