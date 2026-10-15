import { skills } from '../content';
import { SectionTitle } from './SectionTitle';

export function Skills() {
  return (
    <section className="section container" id="skills" aria-labelledby="skills-title">
      <SectionTitle id="skills-title" title={skills.title} />
      <dl className="skills">
        {skills.groups.map(({ group, items }) => (
          <div className="skill-row" key={group} data-reveal>
            <dt>{group}</dt>
            <dd>
              <ul className="tags">
                {items.map((s) => (
                  <li className="tag" key={s}>
                    {s}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
