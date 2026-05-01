import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Experience {
  title: string;
  company: string;
  period: string;
  bullets: string[];
}

interface Project {
  name: string;
  desc: string;
  url: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  theme = 'light';
  year = new Date().getFullYear();

  experiences: Experience[] = [
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
  ];

  skills: string[] = [
    'Flutter', 'Dart', 'Cross-Platform App Development', 'MVVM Architecture',
    'State Management', 'MQTT Integration', 'Java', 'Spring Boot', 'Node.js',
    'Django', 'TypeScript', 'Python', 'GraphQL', 'Azure API Integration',
    'Firebase', 'MongoDB', 'CI/CD (Jenkins, Release Pipelines)', 'REST APIs',
    'Cloud Deployment (GCP)',
  ];

  projects: Project[] = [
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
  ];

  private messageHandler = (e: MessageEvent) => {
    if (typeof e.data === 'string' && e.data.startsWith('theme:')) {
      this.theme = e.data.replace('theme:', '');
    }
  };

  private revealObserver!: IntersectionObserver;

  ngOnInit() {
    window.addEventListener('message', this.messageHandler);
  }

  ngAfterViewInit() {
    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this.revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll('.reveal').forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${i * 70}ms`;
      this.revealObserver.observe(el);
    });
  }

  ngOnDestroy() {
    window.removeEventListener('message', this.messageHandler);
    this.revealObserver?.disconnect();
  }
}
