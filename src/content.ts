/**
 * All site copy lives here. Edit text, links and lists in this file;
 * src/render.ts only reads from it. No em dashes in copy (see DESIGN.md).
 */

export const site = {
  url: 'https://jneela.dev',
  title: 'Jashwanth Neela, Full Stack Engineer moving into AI',
  description:
    'Jashwanth Neela builds web and mobile products end to end, and open-source developer tools, including a test harness for AI-generated interfaces.',
};

export const person = {
  name: 'Jashwanth Neela',
  role: 'Full Stack Engineer',
  roleLine: 'Full stack engineer, moving into AI engineering.',
  intro:
    'I build products end to end, from the interface to the services and data behind it. Lately that means AI: LLM features, agent tooling, and a test harness that replays what a GenUI agent streamed.',
  location: 'Michigan, USA',
};

export const links = {
  // Published on the public site, as on the previous version.
  email: 'jashwanthn066@gmail.com',
  github: 'https://github.com/NJashwanth',
  linkedin: 'https://www.linkedin.com/in/jashwanth-neela-software-engineer/',
  pubDev: 'https://pub.dev/publishers/jneela.dev/packages',
  marketplace: 'https://marketplace.visualstudio.com/publishers/JashwanthNeela',
};

export const nav = [
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Stack', href: '#stack' },
  { label: 'Contact', href: '#contact' },
];

/** The hero's layered stack, top to bottom. Drawn in SVG and in 3D. */
export const layers = ['Interface', 'API', 'Services', 'Data', 'Model'];

/**
 * What the stage shows for a project. Code samples are real excerpts from
 * each repo's README or source; images are the repo's own screenshots.
 */
export type Sheet =
  | { kind: 'fixture' }
  | { kind: 'proxy' }
  | { kind: 'code'; file: string; lang: string; code: string }
  | { kind: 'video'; src: string; poster: string; width: number; height: number; alt: string }
  | { kind: 'image'; images: { src: string; width: number; height: number; alt: string }[]; fit?: 'phone' };

/**
 * `stats` looks the figures up in src/data/stats.json: a pub.dev package
 * name, or a Marketplace `publisher.extension` id.
 */
export type WorkItem = {
  id: string;
  name: string;
  kind: string;
  description: string;
  stats?: { registry: 'pub'; id: string } | { registry: 'vscode'; id: string };
  links: { label: string; href: string }[];
  sheet: Sheet;
};

export const work = {
  title: 'Selected Work',
  intro:
    'Packages, extensions and apps I build and maintain. Figures come from pub.dev and the VS Code Marketplace and refresh every week.',
};

export const workItems: WorkItem[] = [
  {
    id: 'genui-mock',
    name: 'genui_mock',
    kind: 'Dart package for testing AI interfaces',
    description:
      'Records a GenUI streaming session once, saves it as a small JSON fixture, and replays it in widget tests with no network and no API key. Re-recording shows up as a readable diff.',
    stats: { registry: 'pub', id: 'genui_mock' },
    links: [
      { label: 'pub.dev', href: 'https://pub.dev/packages/genui_mock' },
      { label: 'Source', href: 'https://github.com/NJashwanth/genui_mock' },
    ],
    sheet: { kind: 'fixture' },
  },
  {
    id: 'token-meter',
    name: 'Token Meter',
    kind: 'VS Code extension',
    description:
      'A local proxy between your code and the Anthropic API that reads the token usage from every response and shows it live in the editor. The API key stays in VS Code’s encrypted SecretStorage.',
    stats: { registry: 'vscode', id: 'JashwanthNeela.token-meter' },
    links: [
      { label: 'Marketplace', href: 'https://marketplace.visualstudio.com/items?itemName=JashwanthNeela.token-meter' },
      { label: 'Source', href: 'https://github.com/NJashwanth/token_meter' },
    ],
    sheet: { kind: 'proxy' },
  },
  {
    id: 'broken-glass',
    name: 'broken_glass',
    kind: 'Flutter package',
    description: 'Breaks any Flutter widget like a pane of glass, with radial fractures, tumbling shards and lit edges.',
    stats: { registry: 'pub', id: 'broken_glass' },
    links: [
      { label: 'pub.dev', href: 'https://pub.dev/packages/broken_glass' },
      { label: 'Source', href: 'https://github.com/NJashwanth/broken_glass' },
    ],
    sheet: {
      kind: 'video',
      src: '/work/broken-glass.mp4',
      poster: '/work/broken-glass-poster.webp',
      width: 760,
      height: 706,
      alt: 'A card reading “Handle with care” cracks from the point it is tapped and falls apart into shards, then reassembles.',
    },
  },
  {
    id: 'flutter-mock-server',
    name: 'flutter_mock_server',
    kind: 'Dart CLI',
    description:
      'A local mock API for Flutter and Dart apps, defined in one YAML file: static and stateful routes, CRUD simulation, deterministic seeded data and hot reload.',
    stats: { registry: 'pub', id: 'flutter_mock_server' },
    links: [
      { label: 'pub.dev', href: 'https://pub.dev/packages/flutter_mock_server' },
      { label: 'Source', href: 'https://github.com/NJashwanth/flutter_mock_server' },
    ],
    sheet: {
      kind: 'code',
      file: 'mock.yaml',
      lang: 'yaml',
      code: `seed: 42

models:
  User:
    id: uuid
    name: name
    email: email
    role:
      enum: [admin, member, viewer]

stores:
  users:
    model: User
    count: 8

routes:
  - path: /users
    method: GET
    action: list
    store: users

  - path: /users/:id
    method: PUT
    action: update
    store: users

  - path: /session
    method: POST
    response:
      status: 201
      body:
        token: "{{uuid}}"
        message: Signed in`,
    },
  },
  {
    id: 'feature-flag-audit',
    name: 'feature_flag_audit',
    kind: 'Dart CLI',
    description:
      'Finds every feature flag key in a Flutter codebase, resolves keys behind wrapper classes, compares them with Firebase Remote Config, and passes, warns or fails the pipeline by policy.',
    stats: { registry: 'pub', id: 'feature_flag_audit' },
    links: [
      { label: 'pub.dev', href: 'https://pub.dev/packages/feature_flag_audit' },
      { label: 'Source', href: 'https://github.com/NJashwanth/feature_flag_audit' },
    ],
    sheet: {
      kind: 'code',
      file: 'feature_flag_audit.yaml',
      lang: 'yaml',
      code: `feature_flag_audit:
  scan:
    include:
      - lib
    exclude:
      - build
      - .dart_tool

  detection:
    usage_methods:
      - getBool
      - getString
    wrapper_methods:
      - boolConfigValueProvider
    key_classes:
      - RemoteConfigKeys

  policy:
    code_only_keys: warn
    console_only_keys: warn
    unresolved_references: warn`,
    },
  },
  {
    id: 'folder-lens',
    name: 'Flutter Folder Lens',
    kind: 'VS Code extension',
    description:
      'A file icon theme that knows Flutter projects: coloured, shape-coded folders for screens, widgets, models, state, services, tests and platform code.',
    stats: { registry: 'vscode', id: 'JashwanthNeela.flutter-folder-lens' },
    links: [
      { label: 'Marketplace', href: 'https://marketplace.visualstudio.com/items?itemName=JashwanthNeela.flutter-folder-lens' },
      { label: 'Source', href: 'https://github.com/NJashwanth/flutter_folder_lens' },
    ],
    sheet: {
      kind: 'image',
      images: [
        {
          src: '/work/folder-lens.webp',
          width: 720,
          height: 963,
          alt: 'VS Code explorer with Flutter Folder Lens: lib folders such as api, bloc, models, screens and widgets each have their own icon and colour.',
        },
      ],
    },
  },
  {
    id: 'catan',
    name: 'Catan Map Generator',
    kind: 'Web app',
    description:
      'Random, balanced boards for two to six players, with fairness checks, seeded shareable links and an illustrated SVG board. Plain HTML, CSS and JavaScript.',
    links: [
      { label: 'Open the app', href: 'https://catan-boardgame-map-generator.web.app' },
      { label: 'Source', href: 'https://github.com/NJashwanth/catan_map_generator' },
    ],
    sheet: {
      kind: 'image',
      images: [
        {
          src: '/work/catan.webp',
          width: 1200,
          height: 824,
          alt: 'Catan Map Generator showing map controls beside a generated five-player board of hex tiles with number tokens and harbors.',
        },
      ],
    },
  },
  {
    id: 'gridx',
    name: 'GridX',
    kind: 'Flutter game',
    description: 'A 2048-inspired sliding-tile puzzle game for Android and iOS.',
    links: [{ label: 'Source', href: 'https://github.com/NJashwanth/GridX' }],
    sheet: {
      kind: 'image',
      fit: 'phone',
      images: [
        { src: '/projects/gridx-home.webp', width: 256, height: 555, alt: 'GridX home screen' },
        { src: '/projects/gridx-gameplay.webp', width: 256, height: 555, alt: 'GridX gameplay: a 4 by 4 board with a score of 224' },
      ],
    },
  },
];

export type LedgerItem = {
  name: string;
  kind: string;
  year: number;
  href: string;
  stats?: { registry: 'pub'; id: string } | { registry: 'vscode'; id: string };
};

export const ledger = {
  title: 'Also Shipped',
  intro: 'Smaller tools and apps, all public on GitHub.',
  items: [
    {
      name: 'Log Sight',
      kind: 'VS Code extension, a filterable log panel for debug sessions',
      year: 2026,
      href: 'https://marketplace.visualstudio.com/items?itemName=JashwanthNeela.log-sight',
      stats: { registry: 'vscode', id: 'JashwanthNeela.log-sight' },
    },
    {
      name: 'lifecycle_logger',
      kind: 'Flutter package that logs app, route and widget lifecycle events',
      year: 2026,
      href: 'https://pub.dev/packages/lifecycle_logger',
      stats: { registry: 'pub', id: 'lifecycle_logger' },
    },
    {
      name: 'Sizer',
      kind: 'VS Code extension that shows file size in the status bar',
      year: 2026,
      href: 'https://marketplace.visualstudio.com/items?itemName=JashwanthNeela.sizer',
      stats: { registry: 'vscode', id: 'JashwanthNeela.sizer' },
    },
    {
      name: 'QR Code Generator',
      kind: 'Web app that draws a QR code as you type, PNG or SVG',
      year: 2026,
      href: 'https://github.com/NJashwanth/qr-code-generator',
    },
    {
      name: 'organize_it_backend',
      kind: 'Spring Boot 3 and MongoDB service for tasks and task groups',
      year: 2025,
      href: 'https://github.com/NJashwanth/organize_it_backend',
    },
    {
      name: 'OrganizeIt',
      kind: 'Flutter task app with Riverpod, Dio and Freezed',
      year: 2025,
      href: 'https://github.com/NJashwanth/organize_it',
    },
  ] satisfies LedgerItem[],
};

export type Role = {
  company: string;
  title: string;
  /** "Mon YYYY". Listed newest first by this date. */
  start: string;
  end: string;
  summary: string;
};

export const experience = {
  title: 'Experience',
  intro: 'Seven roles since 2018, from founding engineer to senior engineer.',
  roles: [
    {
      company: 'Whisker',
      title: 'Senior Software Engineer',
      start: 'Feb 2025',
      end: 'Present',
      summary:
        'Build and maintain the Android and iOS apps in Flutter. Implemented MVVM architecture, MQTT communication, observability and CI/CD release workflows.',
    },
    {
      company: 'SafetyIQ',
      title: 'Senior Developer',
      start: 'Mar 2024',
      end: 'Jun 2024',
      summary:
        'Developed scalable Flutter applications for Android, iOS and the web. Led feature delivery and mentored developers on Dart and state management.',
    },
    {
      company: 'IDEXX',
      title: 'Software Development Intern',
      start: 'Jun 2023',
      end: 'Aug 2023',
      summary:
        'Built features from reusable widgets and package integrations. Integrated Azure APIs and GraphQL, and supported widget testing and CI.',
    },
    {
      company: 'Gold Setu',
      title: 'Software Engineer',
      start: 'Oct 2021',
      end: 'Feb 2022',
      summary:
        'Integrated Cashfree payment flows, including Payment Links and Payouts. Built backend services with Spring Boot, Firebase and MongoDB.',
    },
    {
      company: 'Gridlex',
      title: 'Software Engineer',
      start: 'Jun 2021',
      end: 'Dec 2022',
      summary:
        'Built backend services in Node.js and Django for high-traffic applications, and delivered Flutter apps, CI/CD pipelines and cloud-backed data solutions.',
    },
    {
      company: 'Lemon Insurance',
      title: 'Software Engineer',
      start: 'Oct 2020',
      end: 'Jun 2021',
      summary: 'Developed cross-platform Android and iOS apps. Set up CI/CD with Jenkins and managed services on GCP.',
    },
    {
      company: 'Ballebaaz',
      title: 'Founding Engineer',
      start: 'Jun 2018',
      end: 'Sep 2020',
      summary:
        'Led mobile development and backend integrations with Node.js and Spring Boot. Established CI/CD pipelines and test-driven engineering practices.',
    },
  ] satisfies Role[],
};

export const stack = {
  title: 'Stack',
  intro: 'What I reach for, grouped by where it sits in a product.',
  groups: [
    { group: 'AI', items: ['LLM APIs', 'Prompt engineering', 'Agents', 'RAG', 'GenUI and A2UI testing'] },
    { group: 'Frontend', items: ['React', 'TypeScript', 'JavaScript', 'Flutter', 'Dart', 'Flutter Web'] },
    {
      group: 'Backend',
      items: ['Node.js', 'Spring Boot', 'Django', 'Python', 'Java', 'REST', 'GraphQL', 'MongoDB', 'Firebase', 'SQL'],
    },
    { group: 'Cloud and DevOps', items: ['GCP', 'Azure', 'GitHub Actions', 'Jenkins', 'CI/CD', 'Release pipelines', 'Observability'] },
    { group: 'Mobile', items: ['Android', 'iOS', 'MVVM', 'State management', 'MQTT', 'Widget testing'] },
  ],
};

export const contact = {
  title: 'Contact',
  promptMuted: 'Hiring, building something, or curious about a package?',
  prompt: 'Write to me here.',
  fieldLabel: 'Your message',
  placeholder: 'Hi Jashwanth, …',
  submitLabel: 'Open in Your Email App',
  note: 'Opens your email app with this message addressed to me.',
};
