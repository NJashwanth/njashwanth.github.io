import type { ReactNode } from 'react';

type Props = { id: string; title: string; children?: ReactNode };

/** Section heading: size and weight only, with an optional one-line lead. */
export function SectionTitle({ id, title, children }: Props) {
  return (
    <header className="section__head">
      <h2 className="section__title" id={id} data-reveal>
        {title}
      </h2>
      {children && (
        <p className="section__lead" data-reveal>
          {children}
        </p>
      )}
    </header>
  );
}
