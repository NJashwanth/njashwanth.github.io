import { contact, links } from '../content';
import { Magnetic } from './Magnetic';
import { ArrowUpRight, MailIcon } from './Icons';

export function Contact() {
  return (
    <section className="section container contact" id="contact" aria-labelledby="contact-title">
      <h2 className="contact__headline" id="contact-title" data-reveal>
        {contact.headline}
      </h2>
      <div className="contact__actions" data-reveal>
        <Magnetic href={`mailto:${links.email}`} className="btn--primary btn--lg">
          <MailIcon />
          {contact.button}
        </Magnetic>
        <a className="link" href={links.github} target="_blank" rel="noreferrer">
          GitHub <ArrowUpRight size={12} />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
        <a className="link" href={links.linkedin} target="_blank" rel="noreferrer">
          LinkedIn <ArrowUpRight size={12} />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </section>
  );
}
