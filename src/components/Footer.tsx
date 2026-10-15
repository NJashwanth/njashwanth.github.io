import { footer, person } from '../content';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {person.name}, {person.location}
        </p>
        <p>{footer.credit}</p>
        <a className="link" href="#top">
          Back to top
        </a>
      </div>
    </footer>
  );
}
