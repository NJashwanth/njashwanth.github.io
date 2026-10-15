import { useRef } from 'react';
import { links, openSource, type OpenSourceItem } from '../content';
import { formatCount, useLiveStats, type Stats } from '../lib/stats';
import { SectionTitle } from './SectionTitle';
import { CopyCommand } from './CopyCommand';
import { ArrowUpRight } from './Icons';

type Stat = { label: string; value: string };

function statsFor(item: OpenSourceItem, stats: Stats): Stat[] {
  if (item.registry === 'pub.dev') {
    const s = stats.pub[item.id];
    if (!s) return [];
    return [
      { label: 'pub points', value: `${s.points}/${s.maxPoints}` },
      { label: s.likes === 1 ? 'like' : 'likes', value: formatCount(s.likes) },
      { label: 'downloads, 30d', value: formatCount(s.downloads30d) },
    ];
  }
  const s = stats.vscode[item.id];
  if (!s) return [];
  return [
    { label: 'installs', value: formatCount(s.installs) },
    ...(s.rating ? [{ label: 'rating', value: `${s.rating.toFixed(1)}/5` }] : []),
  ];
}

const external = <span className="sr-only">(opens in a new tab)</span>;

export function OpenSource() {
  const ref = useRef<HTMLElement>(null);
  const { stats, live } = useLiveStats(openSource.items, ref);

  return (
    <section ref={ref} className="section container" id="open-source" aria-labelledby="os-title">
      <SectionTitle id="os-title" title={openSource.title}>
        {openSource.intro}
      </SectionTitle>

      <ul className="os-track">
        {openSource.items.map((item) => (
          <li className="pkg" key={item.id} data-reveal>
            <p className="pkg__registry">{item.registry === 'pub.dev' ? 'pub.dev package' : 'VS Code extension'}</p>
            <h3 className="pkg__name">
              <a href={item.url} target="_blank" rel="noreferrer">
                {item.name}
                {external}
              </a>
            </h3>
            <p className="pkg__desc">{item.description}</p>
            <dl className="pkg__stats">
              {statsFor(item, stats).map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
            <CopyCommand command={item.install} />
            <p className="pkg__links">
              <a className="link" href={item.url} target="_blank" rel="noreferrer">
                {item.registry === 'pub.dev' ? 'pub.dev' : 'Marketplace'} <ArrowUpRight size={12} />
                {external}
              </a>
              {item.repo && (
                <a className="link" href={item.repo} target="_blank" rel="noreferrer">
                  Source <ArrowUpRight size={12} />
                  {external}
                </a>
              )}
            </p>
          </li>
        ))}
      </ul>

      <div className="os__foot">
        <p className={`os__status${live ? ' is-live' : ''}`}>
          {live ? 'Live stats from pub.dev and the VS Code Marketplace.' : 'Stats from the latest build snapshot.'}
        </p>
        <p className="os__all">
          <a className="link" href={links.pubDev} target="_blank" rel="noreferrer">
            All packages <ArrowUpRight size={12} />
            {external}
          </a>
          <a className="link" href={links.marketplace} target="_blank" rel="noreferrer">
            All extensions <ArrowUpRight size={12} />
            {external}
          </a>
        </p>
      </div>
    </section>
  );
}
