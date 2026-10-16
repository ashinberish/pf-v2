import { useEffect, useState } from 'react'
import { site } from '../site'
import { onIntroDone } from '../intro'
import { prefersReducedMotion } from '../motion'
import { Halftone } from './Halftone'

const Caption = ({ text }: { text: string }) => {
  const words = text.split(' ')
  const count = words.length
  // Server render shows every word lit; the client replays the subtitle effect.
  const [lit, setLit] = useState(count)

  useEffect(() => {
    if (prefersReducedMotion()) return
    setLit(0)
    let timers: number[] = []
    const off = onIntroDone(() => {
      timers = Array.from({ length: count }, (_, k) => window.setTimeout(() => setLit(k + 1), 1700 + k * 160))
    })
    return () => {
      off()
      timers.forEach(clearTimeout)
    }
  }, [count])

  return (
    <p className="caption">
      {words.map((w, k) => (
        <span key={k} className={k < lit ? 'w on' : 'w'}>
          {w}
          {k < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  )
}

export const Hero = () => (
  <header className="hero" id="top" data-surface="light">
    <div className="beams" aria-hidden="true">
      <div className="beam b1" />
      <div className="beam b2" />
      <div className="beam b3" />
    </div>
    <div className="grain" aria-hidden="true" />

    <nav aria-label="Primary">
      <div className="wrap">
        <a className="mono-mark" href="#top" aria-label={`${site.name}, home`}>
          ab.
        </a>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </nav>

    <div className="wrap hero-grid">
      <Halftone alt={`Black and white portrait of ${site.name}`} />
      <div className="title">
        <h1 className="name" aria-label={site.name}>
          <span className="line">
            {[...site.name].map((c, i) => (
              <span key={i} className="ch" style={{ '--i': i } as React.CSSProperties} aria-hidden="true">
                {c === ' ' ? ' ' : c}
              </span>
            ))}
          </span>
        </h1>
        <p className="role">
          <span>{site.role}</span>
          <span>{site.location}</span>
        </p>
        <Caption text={site.caption} />
      </div>
    </div>

    <div className="wrap hero-foot">
      <a href="#about" className="scroll-cue label">
        <span aria-hidden="true" />
        Scroll
      </a>
    </div>
  </header>
)
