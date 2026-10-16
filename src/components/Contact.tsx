import { useEffect, useRef } from 'react'
import { site } from '../site'
import { prefersReducedMotion } from '../motion'

// Pill link that leans toward the cursor.
const MagneticLink = ({ href, label }: { href: string; label: string }) => {
  const ref = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const el = ref.current!
    if (prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`
    }
    const onLeave = () => {
      el.style.transform = ''
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <a className="mag" href={href} ref={ref} target="_blank" rel="me noopener">
      {label}
      <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M3 11 11 3M5 3h6v6" />
      </svg>
    </a>
  )
}

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
          <li key={l.href}><MagneticLink {...l} /></li>
        ))}
      </ul>
    </div>
  </section>
)
