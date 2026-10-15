import { about } from '../content';

export function About() {
  return (
    <section className="section container about" id="about" aria-labelledby="about-title">
      <h2 className="section__title about__title" id="about-title" data-reveal>
        {about.title}
      </h2>
      <div className="about__body" data-reveal>
        {about.body.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>
      <dl className="facts" data-reveal>
        {about.facts.map((f) => (
          <div key={f.label}>
            <dt>{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
