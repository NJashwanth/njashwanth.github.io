/**
 * All site copy lives here. Edit text, links and lists in this file;
 * components only read from it.
 */

export const site = {
  url: 'https://jneela.dev',
  title: 'Jashwanth Neela | Full Stack Engineer moving into AI',
  description:
    'Jashwanth Neela is a Full Stack Engineer moving into AI: building web and mobile products, the services behind them, and LLM-powered features.',
};

export const person = {
  name: 'Jashwanth Neela',
  role: 'Full Stack Engineer',
  roleLine: 'Full Stack Engineer, building toward AI engineering',
  location: 'Michigan, USA',
  valueProp:
    'I build products end to end: interfaces on web and mobile, the APIs and services behind them, and the pipelines that ship them. Lately I’m focused on AI: LLM-powered features, agent tooling, and testing generative UI.',
};

export const links = {
  // NOTE: this address is published on the public site. Swap it for a
  // domain address (e.g. hello@jneela.dev) if you'd rather not expose it.
  email: 'jashwanthn066@gmail.com',
  github: 'https://github.com/NJashwanth',
  linkedin: 'https://www.linkedin.com/in/jashwanth-neela-software-engineer/',
  pubDev: 'https://pub.dev/publishers/jneela.dev/packages',
  marketplace: 'https://marketplace.visualstudio.com/publishers/JashwanthNeela',
};

export const nav = [
  { label: 'About', href: '#about' },
  { label: 'AI & Open Source', href: '#open-source' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#work' },
  { label: 'Contact', href: '#contact' },
];

/**
 * The hero's 3D stack, top to bottom. `tools` appear when a layer is hovered.
 */
export const stack = [
  { label: 'Interface', tools: 'React, TypeScript, Flutter' },
  { label: 'API', tools: 'REST, GraphQL' },
  { label: 'Services', tools: 'Node.js, Spring Boot, Django' },
  { label: 'Data', tools: 'MongoDB, Firebase' },
  { label: 'AI Model', tools: 'LLM APIs, RAG, agents' },
];

export const about = {
  title: 'About',
  body: [
    'I’m a full stack engineer with 5+ years of building production software end to end: interfaces in React, TypeScript and Flutter, services in Node.js, Spring Boot, Django and Python, and the cloud infrastructure and CI/CD pipelines that get them to users.',
    'Now I’m moving into AI engineering. I’m focused on LLM-powered product features, agent tooling, and testing generative UI, and I learn by building in the open: genui_mock, my record-and-replay testing library for agent-generated interfaces, is where most of that work lands today.',
  ],
  facts: [
    { label: 'Experience', value: '5+ years' },
    { label: 'Frontend', value: 'React, TypeScript, Flutter' },
    { label: 'Backend', value: 'Node.js, Spring Boot, Django, Python' },
    { label: 'Now', value: 'LLM apps, agents, GenUI' },
  ],
};

export type Role = {
  company: string;
  title: string;
  /** "Mon YYYY". The list is sorted newest first by this date. */
  start: string;
  end: string;
  bullets: [string, string];
  tags: string[];
};

export const experience: Role[] = [
  {
    company: 'Whisker',
    title: 'Senior Software Engineer',
    start: 'Feb 2025',
    end: 'Present',
    bullets: [
      'Build and maintain the Flutter and Dart apps for Android and iOS.',
      'Implemented MVVM architecture, MQTT communication, observability and CI/CD release workflows.',
    ],
    tags: ['Flutter', 'Dart', 'MVVM', 'MQTT', 'CI/CD'],
  },
  {
    company: 'SafetyIQ',
    title: 'Senior Developer',
    start: 'Mar 2024',
    end: 'Jun 2024',
    bullets: [
      'Developed scalable Flutter applications for Android, iOS and the web.',
      'Led feature delivery and mentored developers on Flutter, Dart and state management.',
    ],
    tags: ['Flutter', 'Dart', 'Flutter Web', 'State management'],
  },
  {
    company: 'IDEXX',
    title: 'Software Development Intern',
    start: 'Jun 2023',
    end: 'Aug 2023',
    bullets: [
      'Built Flutter features from reusable widgets and package-based integrations.',
      'Integrated Azure APIs and GraphQL, and supported widget testing and CI.',
    ],
    tags: ['Flutter', 'Azure', 'GraphQL', 'Widget tests'],
  },
  {
    company: 'Gridlex',
    title: 'Software Engineer',
    start: 'Jun 2021',
    end: 'Dec 2022',
    bullets: [
      'Built backend services in Node.js and Django for high-traffic applications.',
      'Delivered Flutter apps, CI/CD pipelines and cloud-backed data solutions.',
    ],
    tags: ['Node.js', 'Django', 'Flutter', 'CI/CD'],
  },
  {
    company: 'Lemon Insurance',
    title: 'Software Engineer',
    start: 'Oct 2020',
    end: 'Jun 2021',
    bullets: [
      'Developed cross-platform Android and iOS apps with Flutter and Dart.',
      'Set up CI/CD with Jenkins and managed services on GCP.',
    ],
    tags: ['Flutter', 'Dart', 'Jenkins', 'GCP'],
  },
  {
    company: 'Gold Setu',
    title: 'Software Engineer',
    start: 'Oct 2021',
    end: 'Feb 2022',
    bullets: [
      'Integrated Cashfree payment flows, including Payment Links and Payouts.',
      'Built backend services with Spring Boot, Firebase and MongoDB.',
    ],
    tags: ['Spring Boot', 'Firebase', 'MongoDB', 'Payments'],
  },
  {
    company: 'Ballebaaz',
    title: 'Founding Engineer',
    start: 'Jun 2018',
    end: 'Sep 2020',
    bullets: [
      'Led Flutter mobile development and backend integrations with Node.js and Spring Boot.',
      'Established CI/CD pipelines and test-driven engineering practices.',
    ],
    tags: ['Flutter', 'Node.js', 'Spring Boot', 'TDD'],
  },
];

/**
 * Open source. `id` must match the package name on pub.dev or the
 * extension id (publisher.name) on the VS Code Marketplace; live stats are
 * looked up by it. `install` is the command shown with a copy button.
 */
export type OpenSourceItem = {
  id: string;
  name: string;
  registry: 'pub.dev' | 'VS Code';
  description: string;
  install: string;
  url: string;
  repo?: string;
};

export const openSource: { title: string; intro: string; items: OpenSourceItem[] } = {
  title: 'AI & Open Source',
  intro: 'Developer tools I build and maintain, starting with testing for agent-generated UI. Published on pub.dev and the VS Code Marketplace.',
  items: [
    {
      id: 'genui_mock',
      name: 'genui_mock',
      registry: 'pub.dev',
      description: 'AI tooling: record-and-replay testing for Google’s GenUI / A2UI agent-generated interfaces, with zero network calls.',
      install: 'flutter pub add dev:genui_mock',
      url: 'https://pub.dev/packages/genui_mock',
      repo: 'https://github.com/NJashwanth/genui_mock',
    },
    {
      id: 'JashwanthNeela.flutter-folder-lens',
      name: 'flutter-folder-lens',
      registry: 'VS Code',
      description: 'Flutter-aware folder icons for screens, widgets, models, state, services and tests.',
      install: 'code --install-extension JashwanthNeela.flutter-folder-lens',
      url: 'https://marketplace.visualstudio.com/items?itemName=JashwanthNeela.flutter-folder-lens',
    },
    {
      id: 'flutter_mock_server',
      name: 'flutter_mock_server',
      registry: 'pub.dev',
      description: 'Local mock API server with YAML routes, stateful CRUD, seeded data and hot reload.',
      install: 'dart pub global activate flutter_mock_server',
      url: 'https://pub.dev/packages/flutter_mock_server',
    },
    {
      id: 'feature_flag_audit',
      name: 'feature_flag_audit',
      registry: 'pub.dev',
      description: 'CLI that audits feature flags and Firebase Remote Config usage in Flutter apps.',
      install: 'dart pub global activate feature_flag_audit',
      url: 'https://pub.dev/packages/feature_flag_audit',
    },
    {
      id: 'broken_glass',
      name: 'broken_glass',
      registry: 'pub.dev',
      description: 'Shatter any Flutter widget like a pane of glass, with radial fractures and shards.',
      install: 'flutter pub add broken_glass',
      url: 'https://pub.dev/packages/broken_glass',
    },
    {
      id: 'JashwanthNeela.log-sight',
      name: 'log-sight',
      registry: 'VS Code',
      description: 'Debug-console style log viewer with timestamps, level filters and regex search.',
      install: 'code --install-extension JashwanthNeela.log-sight',
      url: 'https://marketplace.visualstudio.com/items?itemName=JashwanthNeela.log-sight',
    },
    {
      id: 'JashwanthNeela.token-meter',
      name: 'token-meter',
      registry: 'VS Code',
      description: 'AI tooling: tracks Claude API token consumption in real time.',
      install: 'code --install-extension JashwanthNeela.token-meter',
      url: 'https://marketplace.visualstudio.com/items?itemName=JashwanthNeela.token-meter',
    },
  ],
};

/**
 * Projects. `preview` is either a screenshot in /public or a real excerpt
 * from the repo, shown as a code preview.
 */
export type Project = {
  name: string;
  description: string;
  language: string;
  url: string;
  preview:
    | { kind: 'image'; images: { src: string; alt: string }[] }
    | { kind: 'code'; file: string; code: string };
};

export const work = {
  title: 'Projects',
  intro: 'Side projects across web, mobile and backend.',
};

export const projects: Project[] = [
  {
    name: 'GridX',
    description: 'A 2048-inspired sliding-tile puzzle game built with Flutter.',
    language: 'Dart',
    url: 'https://github.com/NJashwanth/GridX',
    preview: {
      kind: 'image',
      images: [
        { src: '/projects/gridx-home.webp', alt: 'GridX home screen' },
        { src: '/projects/gridx-gameplay.webp', alt: 'GridX gameplay: a 4 by 4 board with score 224' },
      ],
    },
  },
  {
    name: 'lifecycle_logger',
    description: 'Zero-UI Flutter utility that logs app, route and widget lifecycle events.',
    language: 'Dart',
    url: 'https://github.com/NJashwanth/lifecycle_logger',
    preview: {
      kind: 'code',
      file: 'lib/src/widget_lifecycle_mixin.dart',
      code: `mixin LifecycleAware<T extends StatefulWidget> on State<T> {
  @override
  void initState() {
    super.initState();
    LifecycleLog.emit(
      LifecycleEvent(
        type: LifecycleEventType.widgetInitState,
        message: '\${widget.runtimeType} initState',
        timestamp: DateTime.now(),
        widgetName: widget.runtimeType.toString(),
      ),
    );
    onInit();
  }
}`,
    },
  },
  {
    name: 'log_sight',
    description: 'VS Code extension: a focused, filterable log panel for every debug session.',
    language: 'TypeScript',
    url: 'https://github.com/NJashwanth/log_sight',
    preview: {
      kind: 'code',
      file: 'src/logStore.ts',
      code: `export class LogStore {
  private static readonly MAX_ENTRIES = 5000;
  private readonly entries: LogEntry[] = [];

  public add(level: LogLevel, message: string, source = "extension") {
    const entry: LogEntry = {
      id: this.nextId++,
      timestamp: new Date().toISOString(),
      level,
      message,
      source
    };
    this.entries.push(entry);
    this.onDidChangeEmitter.fire(this.getAll());
    return entry;
  }
}`,
    },
  },
  {
    name: 'organize_it_backend',
    description: 'Spring Boot 3 and MongoDB service for tasks and task groups.',
    language: 'Java',
    url: 'https://github.com/NJashwanth/organize_it_backend',
    preview: {
      kind: 'code',
      file: 'controller/TaskController.java',
      code: `@RestController
@RequestMapping("/tasks")
public class TaskController {

    @PostMapping
    public Task createTask(@Valid @RequestBody Task task) {
        Instant now = Instant.now();
        if (task.getCreatedAt() == null) task.setCreatedAt(now);
        task.setUpdatedAt(now);

        Task saved = taskRepository.save(task);

        // Keep group task list in sync when a new task is created.
        String gid = saved.getGroupId();
        // ...

        return saved;
    }
}`,
    },
  },
];

export const skills: { title: string; groups: { group: string; items: string[] }[] } = {
  title: 'Skills',
  groups: [
    { group: 'AI', items: ['LLM APIs', 'Prompt engineering', 'Agents', 'RAG', 'GenUI / A2UI testing'] },
    { group: 'Frontend', items: ['React', 'TypeScript', 'JavaScript', 'Flutter', 'Dart', 'Flutter Web'] },
    {
      group: 'Backend',
      items: ['Node.js', 'Spring Boot', 'Django', 'Python', 'Java', 'REST', 'GraphQL', 'MongoDB', 'Firebase', 'SQL'],
    },
    {
      group: 'Cloud & DevOps',
      items: ['GCP', 'Azure', 'GitHub Actions', 'Jenkins', 'CI/CD', 'Release pipelines', 'Observability'],
    },
    { group: 'Mobile', items: ['Android', 'iOS', 'MVVM', 'State management', 'MQTT', 'Widget testing'] },
  ],
};

export const contact = {
  headline: 'Let’s build something.',
  button: 'Email me',
};

export const footer = {
  credit: 'Designed and built by Jashwanth',
};
