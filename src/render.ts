/**
 * Renders the whole page to static HTML at build time (and on each dev
 * request). The client script only adds behaviour; with JS off the page is
 * complete. Markup structure and class names are fixed by DESIGN.md.
 */
import {
  contact,
  experience,
  layers,
  ledger,
  links,
  nav,
  person,
  stack,
  work,
  workItems,
  type LedgerItem,
  type Sheet,
  type WorkItem,
} from './content.ts';
import { svgStack } from './stack-geometry.ts';

export type PubStats = { version?: string; points: number; maxPoints: number; likes: number; downloads30d: number };
export type VsStats = { version?: string; installs: number; rating: number | null; ratingCount: number };
export type Stats = { fetchedAt?: string; pub: Record<string, PubStats>; vscode: Record<string, VsStats> };

/** Lets snake_case names wrap after an underscore instead of overflowing. */
const breakable = (s: string) => esc(s).replace(/_/g, '_<wbr>');
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = new Intl.NumberFormat('en-US');
const external = (href: string) => (href.startsWith('http') ? ' rel="noopener" target="_blank"' : '');
const link = (label: string, href: string, cls = 'link') =>
  `<a class="${cls}" href="${esc(href)}"${external(href)}>${esc(label)}</a>`;

/** Figures for a package or extension as label/value pairs, or [] if the snapshot lacks it. */
function figures(ref: WorkItem['stats'], stats: Stats): [string, string][] {
  if (!ref) return [];
  if (ref.registry === 'pub') {
    const s = stats.pub[ref.id];
    if (!s) return [];
    const out: [string, string][] = [
      ['Pub points', `${s.points}/${s.maxPoints}`],
      ['Downloads, 30 days', num.format(s.downloads30d)],
    ];
    if (s.version) out.push(['Version', s.version]);
    return out;
  }
  const s = stats.vscode[ref.id];
  if (!s) return [];
  const out: [string, string][] = [['Installs', num.format(s.installs)]];
  if (s.rating != null && s.ratingCount > 0) {
    out.push(['Rating', `${s.rating.toFixed(1)} from ${s.ratingCount} ${s.ratingCount === 1 ? 'review' : 'reviews'}`]);
  }
  if (s.version) out.push(['Version', s.version]);
  return out;
}

/** The one figure the ledger shows. */
function headline(ref: LedgerItem['stats'], stats: Stats) {
  const [label, value] = figures(ref, stats)[0] ?? [];
  if (!label) return '';
  return label === 'Pub points' ? `${value} pub points` : `${value} ${label.toLowerCase()}`;
}

/**
 * Scroll-linked reveal (StringProgress): 0 when the element's top meets the viewport bottom,
 * 1 once it is 22% of the viewport further in. CSS reads --progress. For project entries and
 * experience rows.
 */
const scrub = ' string="progress" string-enter-el="top" string-enter-vp="bottom" string-exit-el="top" string-exit-vp="bottom" string-offset-top="22%" data-reveal';
/**
 * One-shot reveal: a StringTune object with the default in-view window, so it receives -inview
 * whenever any part of it is on screen (including when the page loads already scrolled past it).
 */
const reveal = ' string="progress" data-reveal';
/** StringSplit word reveal for headings, played when the heading comes into view. */
const splitWords = ' string="split" string-split="word-line[start]"';

const icon = {
  sun: '<svg class="icon icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1"/></svg>',
  moon: '<svg class="icon icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1Z"/></svg>',
  arrow: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>',
};

function stackSvg(id: string) {
  const { viewBox, slabs } = svgStack(layers);
  // Painted bottom slab first; each layer above drifts a little further, so the stack opens up as it scrolls.
  // slab--1 is the top layer (Interface), slab--5 the model; CSS colours them along the accent ramp.
  const body = slabs
    .map(
      (s, i) => `<g class="slab slab--${slabs.length - i}" string="parallax[]" string-parallax="${(-0.04 * i).toFixed(2)}">
        <polygon class="slab__front" points="${s.front}"/>
        <polygon class="slab__right" points="${s.right}"/>
        <polygon class="slab__top" points="${s.top}"/>
        <text class="slab__label" x="${s.labelX.toFixed(1)}" y="${s.labelY.toFixed(1)}">${esc(s.label)}</text>
      </g>`,
    )
    .join('');
  return `<svg class="stack-svg" viewBox="${viewBox}" role="img" aria-labelledby="${id}">
      <title id="${id}">A stack of five layers, top to bottom: ${layers.join(', ')}</title>${body}</svg>`;
}

// The fixture from genui_mock's README, chunk for chunk.
const fixtureChunks: { text: string; delayMs: number }[] = [
  { text: 'Here you go:\\n', delayMs: 0 },
  {
    text: '```json\\n{\\"version\\": \\"v0.9\\", \\"createSurface\\": {\\"surfaceId\\": \\"greeting\\", \\"catalogId\\": \\"https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json\\"}}\\n```',
    delayMs: 300,
  },
  {
    text: '```json\\n{\\"version\\": \\"v0.9\\", \\"updateComponents\\": {\\"surfaceId\\": \\"greeting\\", \\"components\\": [{\\"id\\": \\"root\\", \\"component\\": \\"Text\\", \\"text\\": \\"Hello!\\"}]}}\\n```',
    delayMs: 400,
  },
];

function fixtureSheet() {
  const chunks = fixtureChunks
    .map(
      (c, i) =>
        `<span class="chunk" data-chunk data-delay="${c.delayMs}">        { "text": "${esc(c.text)}", "delayMs": ${c.delayMs} }${i < fixtureChunks.length - 1 ? ',' : ''}</span>`,
    )
    .join('\n');
  const code = `{
  "formatVersion": 1,
  "name": "greeting",
  "description": "user asks for a friendly greeting",
  "recordedAt": "2026-07-02T10:15:00.000Z",
  "turns": [
    {
      "label": "asks for a greeting",
      "chunks": [
${chunks}
      ]
    }
  ]
}`;
  return `<div class="ui ui--fixture" data-ui data-replay-target="genui-mock">
      <p class="ui__bar"><span translate="no">test/fixtures/greeting.json</span></p>
      <pre class="ui__code ui__code--wrap" translate="no"><code>${code}</code></pre>
      <div class="ui__surface">
        <p class="ui__surface-label">Surface <span translate="no">“greeting”</span>, rendered by the <span translate="no">Text</span> component</p>
        <p class="ui__hello" data-surface>Hello!</p>
      </div>
    </div>`;
}

function proxySheet() {
  return `<div class="ui ui--proxy" data-ui>
      <p class="ui__bar"><span>How it works, from the README</span></p>
      <ol class="ui__flow" translate="no">
        <li>Your App</li>
        <li>Token Meter Proxy<span>localhost:3847</span></li>
        <li>api.anthropic.com</li>
      </ol>
      <p class="ui__caption">Tracks tokens and displays them in VS Code</p>
      <pre class="ui__code" translate="no"><code>from anthropic import Anthropic

client = Anthropic(base_url="http://localhost:3847")
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello"}]
)</code></pre>
    </div>`;
}

function sheetHtml(item: WorkItem) {
  const sheet: Sheet = item.sheet;
  switch (sheet.kind) {
    case 'fixture':
      return fixtureSheet();
    case 'proxy':
      return proxySheet();
    case 'code':
      return `<div class="ui ui--code" data-ui>
      <p class="ui__bar"><span translate="no">${esc(sheet.file)}</span></p>
      <pre class="ui__code" translate="no"><code>${esc(sheet.code)}</code></pre>
    </div>`;
    case 'video':
      return `<video class="sheet-video" data-video="${item.id}" muted loop playsinline preload="none"
        poster="${sheet.poster}" width="${sheet.width}" height="${sheet.height}" aria-label="${esc(sheet.alt)}">
        <source src="${sheet.src}" type="video/mp4">
      </video>`;
    case 'image':
      return `<div class="sheet-images${sheet.fit === 'phone' ? ' sheet-images--phone' : ''}">${sheet.images
        .map(
          (im) =>
            `<img string="lazy" string-lazy="${im.src}" width="${im.width}" height="${im.height}" alt="${esc(im.alt)}"><noscript><img src="${im.src}" width="${im.width}" height="${im.height}" alt="${esc(im.alt)}"></noscript>`,
        )
        .join('')}</div>`;
  }
}

function header() {
  return `<header class="site-header wrap">
    <a class="site-header__name" href="#top">${esc(person.name)}</a>
    <nav class="site-header__nav" aria-label="Primary">
      <ul class="site-nav">${nav.map((n) => `<li>${link(n.label, n.href, 'nav-link')}</li>`).join('')}</ul>
      <button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch color theme">${icon.sun}${icon.moon}</button>
    </nav>
  </header>`;
}

function hero() {
  const [first, ...rest] = person.name.split(' ');
  return `<section class="hero wrap" id="top" aria-labelledby="hero-title"
      string="progress" string-id="hero" string-enter-el="top" string-enter-vp="top" string-exit-el="bottom" string-exit-vp="top">
    <div class="hero__art">
      ${stackSvg('stack-title')}
      <div class="stack-3d" data-stack-3d aria-hidden="true">${layers.map((l) => `<span class="stack-3d__label">${esc(l)}</span>`).join('')}</div>
    </div>
    <div class="hero__text">
      <h1 class="hero__name" id="hero-title" data-split-intro>${esc(first)} <br>${esc(rest.join(' '))}</h1>
      <p class="hero__role">${esc(person.roleLine)}</p>
      <p class="hero__intro">${esc(person.intro)}</p>
      <p class="hero__actions">
        <a class="button" href="mailto:${links.email}" string="magnetic" string-strength="0.25" string-radius="110">Email Me</a>
        ${link('GitHub', links.github)}
        ${link('LinkedIn', links.linkedin)}
      </p>
    </div>
  </section>`;
}

function workItem(item: WorkItem, stats: Stats) {
  const meta: [string, string][] = [['Type', item.kind], ...figures(item.stats, stats)];
  const extra =
    item.sheet.kind === 'fixture'
      ? `<button class="button button--quiet" type="button" data-replay="genui-mock">Replay the Fixture</button>
         <span class="replay-status" data-replay-status role="status" aria-live="polite"></span>`
      : item.sheet.kind === 'video'
        ? `<button class="button button--quiet" type="button" data-video-toggle="${item.id}" aria-pressed="false">Pause Demo</button>`
        : '';
  return `<li class="work__item" data-item="${item.id}"${scrub}>
      <figure class="sheet sheet--inline sheet--${item.sheet.kind}">${sheetHtml(item)}</figure>
      <div class="work__main">
        <h3 class="work__name"${item.name.includes('_') ? ' translate="no"' : ''}>${breakable(item.name)}</h3>
        <p class="work__desc">${esc(item.description)}</p>
        <p class="work__links">${item.links.map((l) => link(l.label, l.href)).join('')}${extra}</p>
      </div>
      <dl class="work__meta">${meta.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    </li>`;
}

function stage() {
  const sheets = workItems
    .map(
      (item, i) =>
        `<figure class="stage__layer sheet sheet--stage sheet--${item.sheet.kind}${i === 0 ? ' is-active' : ''}" data-layer="${item.id}">${sheetHtml(item)}</figure>`,
    )
    .join('');
  return `<div class="stage" data-show="${workItems[0].id}">${sheets}</div>`;
}

function ledgerRow(item: LedgerItem, stats: Stats) {
  return `<li${reveal}><a class="ledger__row" href="${esc(item.href)}"${external(item.href)}>
      <span class="ledger__name"${item.name.includes('_') ? ' translate="no"' : ''}>${breakable(item.name)}</span>
      <span class="ledger__kind">${esc(item.kind)}</span>
      <span class="ledger__fig">${esc(headline(item.stats, stats))}</span>
      <span class="ledger__year">${item.year}</span>
    </a></li>`;
}

/** Title on the left, the supporting sentence across the right of the grid. */
function sectionHead(id: string, title: string, intro: string) {
  return `<div class="section-head">
      <h2 class="section-title" id="${id}-title"${splitWords}>${esc(title)}</h2>
      <p class="section-intro"${reveal}>${esc(intro)}</p>
    </div>`;
}

export function renderPage(stats: Stats) {
  const year = new Date().getFullYear();
  return `<a class="skip-link" href="#main">Skip to content</a>
${header()}
<main id="main">
  ${hero()}

  <section class="work wrap" id="work" aria-labelledby="work-title">
    ${sectionHead('work', work.title, work.intro)}
    <div class="work__body">
      ${stage()}
      <ul class="work__list" role="list">${workItems.map((i) => workItem(i, stats)).join('')}</ul>
    </div>
  </section>

  <section class="ledger wrap" id="also" aria-labelledby="also-title">
    ${sectionHead('also', ledger.title, ledger.intro)}
    <ul class="ledger__list" role="list">${ledger.items.map((i) => ledgerRow(i, stats)).join('')}</ul>
  </section>

  <section class="experience wrap" id="experience" aria-labelledby="experience-title">
    ${sectionHead('experience', experience.title, experience.intro)}
    <ol class="roles" role="list">${experience.roles
      .map(
        (r) => `<li class="role"${scrub}>
        <p class="role__when"><span class="tnum">${esc(r.start)} to ${esc(r.end)}</span></p>
        <h3 class="role__title">${esc(r.company)}<span>${esc(r.title)}</span></h3>
        <p class="role__summary">${esc(r.summary)}</p>
      </li>`,
      )
      .join('')}</ol>
  </section>

  <section class="stack" id="stack" aria-labelledby="stack-title">
    <div class="wrap">
      ${sectionHead('stack', stack.title, stack.intro)}
      <div class="stack__groups">${stack.groups
        .map(
          (g) => `<div class="stack__group"${reveal}>
          <h3 class="stack__name">${esc(g.group)}</h3>
          <ul class="stack__items" role="list">${g.items.map((i) => `<li translate="no">${esc(i)}</li>`).join('')}</ul>
        </div>`,
        )
        .join('')}</div>
    </div>
  </section>

  <section class="contact" id="contact" aria-labelledby="contact-title">
    <div class="contact__inner wrap">
      <div class="contact__main">
        <h2 class="section-title" id="contact-title"${splitWords}>${esc(contact.title)}</h2>
        <p class="contact__prompt"><span>${esc(contact.promptMuted)}</span> ${esc(contact.prompt)}</p>
        <form class="contact__form" action="mailto:${links.email}" method="get" data-mail-form data-email="${links.email}">
          <label class="visually-hidden" for="message">${esc(contact.fieldLabel)}</label>
          <input type="hidden" name="subject" value="Hello from jneela.dev">
          <div class="contact__field">
            <input id="message" name="body" type="text" autocomplete="off" placeholder="${esc(contact.placeholder)}" aria-describedby="message-note" required>
            <button class="contact__send" type="submit" aria-label="${esc(contact.submitLabel)}" string="magnetic" string-strength="0.3" string-radius="90">${icon.arrow}</button>
          </div>
          <p class="contact__note" id="message-note">${esc(contact.note)}</p>
        </form>
      </div>
      <dl class="contact__links">
        <div><dt>Email</dt><dd><a class="link" href="mailto:${links.email}">${esc(links.email)}</a></dd></div>
        <div><dt>GitHub</dt><dd>${link('github.com/NJashwanth', links.github)}</dd></div>
        <div><dt>LinkedIn</dt><dd>${link('jashwanth-neela', links.linkedin)}</dd></div>
        <div><dt>Packages</dt><dd>${link('jneela.dev on pub.dev', links.pubDev)}</dd></div>
        <div><dt>Extensions</dt><dd>${link('VS Code Marketplace', links.marketplace)}</dd></div>
      </dl>
    </div>
  </section>
</main>
<footer class="site-footer">
  <div class="wrap">
    <p class="site-footer__name" aria-hidden="true">${esc(person.name)}</p>
    <div class="site-footer__line">
      <p>${esc(person.name)}, ${esc(person.role.toLowerCase())} in ${esc(person.location)}</p>
      <ul class="site-footer__links" role="list">
        <li>${link('GitHub', links.github)}</li>
        <li>${link('LinkedIn', links.linkedin)}</li>
        <li>${link('Email', `mailto:${links.email}`)}</li>
      </ul>
      <p class="tnum">© ${year}</p>
    </div>
  </div>
</footer>`;
}
