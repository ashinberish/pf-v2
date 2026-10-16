import { useEffect, useRef, useState } from 'react'
import { site } from '../site'
import { easeOutCubic, prefersReducedMotion } from '../motion'

const Counter = ({ to }: { to: number }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(to)

  useEffect(() => {
    const el = ref.current!
    if (prefersReducedMotion() || el.getBoundingClientRect().top < window.innerHeight) return
    setValue(0)
    let raf = 0
    const io = new IntersectionObserver(
      entries => {
        if (!entries[0].isIntersecting) return
        io.disconnect()
        const t0 = performance.now()
        const tick = (t: number) => {
          const k = Math.min(1, (t - t0) / 900)
          setValue(Math.round(to * easeOutCubic(k)))
          if (k < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [to])

  return <span ref={ref} className="counter">{value}</span>
}

// Words light up as the statement scrolls through the viewport.
const Statement = () => {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = ref.current!
    const words = el.querySelectorAll<HTMLElement>('.w')
    if (prefersReducedMotion()) {
      words.forEach(w => w.classList.add('lit'))
      return
    }
    el.classList.add('scrub')
    const onScroll = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const prog = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)))
      const n = Math.round(prog * words.length)
      words.forEach((w, k) => w.classList.toggle('lit', k < n))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const words = site.statement.flatMap(part => part.text.split(' ').map(text => ({ text, em: part.em })))
  return (
    <p className="statement" ref={ref}>
      {words.map((w, k) => (
        <span key={k} className="w">
          {w.em ? <em>{w.text}</em> : w.text}
          {k < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  )
}

export const About = () => (
  <section className="band" id="about" aria-labelledby="about-title">
    <div className="wrap">
      <div className="sec-head label reveal">
        <h2 id="about-title">About</h2>
        <span aria-hidden="true">01 / 03</span>
      </div>
      <div className="about-grid">
        <Statement />
        <dl className="facts reveal">
          <div className="fact"><dt>Based in</dt><dd>{site.location}</dd></div>
          <div className="fact"><dt>Writing code since</dt><dd>{site.startYear}</dd></div>
          <div className="fact"><dt>Years shipping</dt><dd><Counter to={new Date().getFullYear() - site.startYear} />+</dd></div>
          <div className="fact"><dt>Current</dt><dd>{site.company}</dd></div>
        </dl>
      </div>
    </div>
  </section>
)
