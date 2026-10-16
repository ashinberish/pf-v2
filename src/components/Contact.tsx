import { site } from '../site'

const SocialLink = ({ href, label }: { href: string; label: string }) => (
  <a className="mag" href={href} target="_blank" rel="me noopener">
    {label}
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 11 11 3M5 3h6v6" />
    </svg>
  </a>
)

export const Contact = () => (
  <section className="band contact" id="contact" data-surface="light" aria-labelledby="contact-title">
    <div className="wrap">
      <div className="sec-head label">
        <h2 id="contact-title">Contact</h2>
        <span aria-hidden="true">03 / 03</span>
      </div>
      <p className="big-cta">
        <span>Let's build</span> <span>something.</span>
      </p>
      <ul className="socials">
        {site.links.map(l => (
          <li key={l.href}><SocialLink {...l} /></li>
        ))}
      </ul>
    </div>
  </section>
)
