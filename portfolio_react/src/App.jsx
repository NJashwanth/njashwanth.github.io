import { useState, useEffect, useRef } from 'react'
import './App.css'

const EXPERIENCES = [
  {
    title: 'Software Engineer II - Apps',
    company: 'Whisker',
    period: 'February 2025 - Present',
    bullets: [
      'Building and maintaining Flutter/Dart applications for Android and iOS.',
      'Implemented MVVM, MQTT communication, observability, and CI/CD release workflows.',
    ],
  },
  {
    title: 'Senior Developer',
    company: 'SafetyIQ',
    period: 'March 2024 - June 2024',
    bullets: [
      'Developed scalable Flutter applications for Android, iOS, and Web.',
      'Led feature delivery and mentored developers on Flutter, Dart, and state management.',
    ],
  },
  {
    title: 'Software Development Intern (Flutter/Dart)',
    company: 'IDEXX',
    period: 'June 2023 - August 2023',
    bullets: [
      'Built Flutter features using reusable widgets and package-based integrations.',
      'Integrated Azure APIs and GraphQL; supported widget testing and CI.',
    ],
  },
  {
    title: 'Software Engineer',
    company: 'Gridlex Services Pvt Ltd',
    period: 'June 2021 - December 2022',
    bullets: [
      'Built backend services using Node.js and Django for high-traffic applications.',
      'Delivered Flutter apps, CI/CD pipelines, and cloud-backed data solutions.',
    ],
  },
  {
    title: 'Software Engineer',
    company: 'Lemon Insurance',
    period: 'October 2020 - June 2021',
    bullets: [
      'Developed robust cross-platform apps for Android and iOS with Flutter/Dart.',
      'Implemented CI/CD with Jenkins and managed services on GCP.',
    ],
  },
  {
    title: 'Software Engineer',
    company: 'Gold Setu',
    period: 'October 2021 - February 2022',
    bullets: [
      'Integrated Cashfree payment flows including Payment Links and Payouts.',
      'Built backend services with Spring Boot, Firebase, and MongoDB.',
    ],
  },
  {
    title: 'Founding Engineer (Software Developer)',
    company: 'Ballebaaz',
    period: 'June 2018 - September 2020',
    bullets: [
      'Led Flutter mobile development and backend integrations using Node.js and Spring Boot.',
      'Established CI/CD pipelines and test-driven engineering practices.',
    ],
  },
]

const SKILLS = [
  'Flutter', 'Dart', 'Cross-Platform App Development', 'MVVM Architecture',
  'State Management', 'MQTT Integration', 'Java', 'Spring Boot', 'Node.js',
  'Django', 'TypeScript', 'Python', 'GraphQL', 'Azure API Integration',
  'Firebase', 'MongoDB', 'CI/CD (Jenkins, Release Pipelines)', 'REST APIs',
  'Cloud Deployment (GCP)',
]

const PROJECTS = [
  {
    name: 'log_sight',
    desc: 'A TypeScript project focused on logging visibility and diagnostics.',
    url: 'https://github.com/NJashwanth/log_sight',
  },
  {
    name: 'lifecycle_logger',
    desc: 'A C++ project centered around lifecycle/event logging workflows.',
    url: 'https://github.com/NJashwanth/lifecycle_logger',
  },
  {
    name: 'GridX',
    desc: 'A Flutter/Dart application showcasing cross-platform product development.',
    url: 'https://github.com/NJashwanth/GridX',
  },
  {
    name: 'organize_it_backend',
    desc: 'Backend service for Organize It, built for structured app workflows.',
    url: 'https://github.com/NJashwanth/organize_it_backend',
  },
]

function useRevealAll() {
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )
    elements.forEach((el, i) => {
      el.style.transitionDelay = `${i * 70}ms`
      observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.08.68-.22.68-.49v-1.73c-2.78.61-3.37-1.2-3.37-1.2-.46-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .08 1.52 1.01 1.52 1.01.88 1.51 2.32 1.07 2.88.82.09-.64.35-1.08.63-1.33-2.22-.25-4.56-1.1-4.56-4.9 0-1.08.39-1.96 1.02-2.65-.1-.25-.44-1.29.1-2.7 0 0 .84-.26 2.75 1.01a9.6 9.6 0 0 1 5 0c1.9-1.27 2.74-1.01 2.74-1.01.54 1.41.2 2.45.1 2.7.64.69 1.02 1.57 1.02 2.65 0 3.81-2.35 4.64-4.58 4.88.36.31.68.93.68 1.89V21c0 .27.18.57.69.49A10 10 0 0 0 12 2z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6.94 8.5a1.56 1.56 0 1 1 0-3.12 1.56 1.56 0 0 1 0 3.12zM5.6 10.1h2.67v8.3H5.6v-8.3zm4.25 0h2.56v1.14h.04c.36-.68 1.23-1.39 2.53-1.39 2.7 0 3.2 1.78 3.2 4.09v4.46h-2.67v-3.95c0-.94-.02-2.15-1.31-2.15-1.31 0-1.5 1.02-1.5 2.08v4.02H9.85v-8.3z" />
    </svg>
  )
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z" />
      <path d="M5 5h6v2H7v10h10v-4h2v6H5V5z" />
    </svg>
  )
}

export default function App() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const nextTheme = theme === 'dark' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', nextTheme)
    document.body.setAttribute('data-theme', nextTheme)
  }, [theme])

  useEffect(() => {
    const handler = (e) => {
      if (typeof e.data === 'string' && e.data.startsWith('theme:')) {
        setTheme(e.data.replace('theme:', ''))
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  useRevealAll()

  return (
    <div data-theme={theme}>
      <header className="site-header">
        <div className="container nav-wrap">
          <a className="brand" href="#">Jashwanth</a>
          <nav>
            <a href="#about">About</a>
            <a href="#experience">Experience</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </nav>
          <span className="tech-badge">Built with React</span>
        </div>
      </header>

      <main>
        <section className="hero container reveal">
          <p className="eyebrow">MS in Information Technology</p>
          <h1>Full Stack Developer and Cross-Platform App Developer</h1>
          <p className="intro">
            I architect and deliver high-quality software solutions across mobile
            and web platforms, with a strong emphasis on performance,
            user-centered design, and measurable business impact.
          </p>
          <div className="hero-actions">
            <a
              className="button social-link"
              href="https://github.com/NJashwanth"
              target="_blank"
              rel="noreferrer"
              aria-label="Open GitHub profile in a new tab"
            >
              <GitHubIcon />
              <span>GitHub</span>
              <span className="external-indicator" aria-hidden="true"><ExternalIcon /></span>
            </a>
            <a
              className="button social-link"
              href="https://www.linkedin.com/in/jashwanth-neela-software-engineer/"
              target="_blank"
              rel="noreferrer"
              aria-label="Open LinkedIn profile in a new tab"
            >
              <LinkedInIcon />
              <span>LinkedIn</span>
              <span className="external-indicator" aria-hidden="true"><ExternalIcon /></span>
            </a>
          </div>
        </section>

        <section id="about" className="container section reveal">
          <h2>About</h2>
          <p>
            I deliver end-to-end software solutions, from scalable backend APIs to
            polished, mobile-first user experiences. My primary expertise is in
            Flutter and Dart, complemented by strong engineering experience in
            Java, TypeScript, and Python across complex production environments.
          </p>
        </section>

        <section id="experience" className="container section reveal">
          <h2>Professional Experience</h2>
          <div className="project-grid">
            {EXPERIENCES.map((exp) => (
              <article className="card" key={exp.company + exp.period}>
                <h3>{exp.title}</h3>
                <p><strong>{exp.company}</strong> | {exp.period}</p>
                <p>{exp.bullets.join(' ')}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="container section reveal">
          <h2>Core Skills</h2>
          <div className="chips">
            {SKILLS.map((s) => <span key={s}>{s}</span>)}
          </div>
        </section>

        <section id="projects" className="container section reveal">
          <h2>Featured Projects</h2>
          <div className="project-grid">
            {PROJECTS.map((p) => (
              <article className="card" key={p.name}>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <a href={p.url} target="_blank" rel="noreferrer">View on GitHub</a>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer id="contact" className="container footer reveal">
        <h2>Contact</h2>
        <p>If you would like to collaborate, connect with me on GitHub or LinkedIn.</p>
        <div className="footer-links">
          <a href="https://github.com/NJashwanth" target="_blank" rel="noreferrer">
            github.com/NJashwanth
          </a>
          <a
            href="https://www.linkedin.com/in/jashwanth-neela-software-engineer/"
            target="_blank"
            rel="noreferrer"
          >
            linkedin.com/in/jashwanth-neela-software-engineer
          </a>
        </div>
        <p className="meta">&copy; {new Date().getFullYear()} Jashwanth</p>
      </footer>
    </div>
  )
}
