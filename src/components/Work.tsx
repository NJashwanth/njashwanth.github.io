import { projects, work, type Project } from '../content';
import { highlight } from '../lib/highlight';
import { SectionTitle } from './SectionTitle';
import { ArrowUpRight } from './Icons';

function Preview({ preview }: { preview: Project['preview'] }) {
  if (preview.kind === 'image') {
    return (
      <div className="project__preview project__preview--shots">
        {preview.images.map((img) => (
          <img
            key={img.src}
            src={img.src}
            srcSet={`${img.src} 256w, ${img.src.replace(/\.webp$/, '@1.5x.webp')} 384w`}
            sizes="128px"
            alt={img.alt}
            width={256}
            height={555}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>
    );
  }
  return (
    <div className="project__preview project__preview--code">
      <p className="project__file">{preview.file}</p>
      <pre tabIndex={0} aria-label={`Code excerpt from ${preview.file}`}>
        <code>{highlight(preview.code)}</code>
      </pre>
    </div>
  );
}

export function Work() {
  return (
    <section className="section container" id="work" aria-labelledby="work-title">
      <SectionTitle id="work-title" title={work.title}>
        {work.intro}
      </SectionTitle>
      <ul className="projects">
        {projects.map((p) => (
          <li className="project" key={p.name} data-reveal>
            <Preview preview={p.preview} />
            <div className="project__body">
              <h3 className="project__name">
                <a href={p.url} target="_blank" rel="noreferrer">
                  {p.name}
                  <span className="sr-only">(GitHub, opens in a new tab)</span>
                </a>
              </h3>
              <p className="project__desc">{p.description}</p>
              <p className="project__meta">
                <span>{p.language}</span>
                <span className="project__cta" aria-hidden="true">
                  View on GitHub <ArrowUpRight size={12} />
                </span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
