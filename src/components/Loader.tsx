import { useEffect, useRef, useState } from 'react'
import portraitJpg from '../assets/portrait.jpg'
import { finishIntro, isIntroPending } from '../intro'
import { prefersReducedMotion } from '../motion'
import { site } from '../site'

const MIN_MS = 1400

// Full-screen intro: counts to 100 while fonts and the portrait load, then wipes up to reveal the hero.
export const Loader = () => {
  const [pct, setPct] = useState(0)
  const [state, setState] = useState<'idle' | 'running' | 'exit' | 'gone'>('idle')
  const target = useRef(0)

  useEffect(() => {
    if (!isIntroPending()) {
      setState('gone')
      return
    }
    if (prefersReducedMotion()) {
      finishIntro()
      setState('gone')
      return
    }
    setState('running')

    const tasks: Promise<unknown>[] = [
      document.fonts?.ready ?? Promise.resolve(),
      new Promise(res => {
        const img = new Image()
        img.onload = img.onerror = res
        img.src = portraitJpg
      }),
      new Promise(res => (document.readyState === 'complete' ? res(null) : window.addEventListener('load', res, { once: true }))),
    ]
    let done = 0
    tasks.forEach(t => t.then(() => { target.current = ++done / tasks.length }))

    const t0 = performance.now()
    let shown = 0
    let raf = 0
    let exitTimer = 0
    const tick = (t: number) => {
      // never run ahead of real progress, and never finish faster than MIN_MS
      const cap = Math.min(target.current, (t - t0) / MIN_MS)
      shown += (cap - shown) * 0.12
      if (cap >= 1 && shown > 0.995) shown = 1
      setPct(Math.round(shown * 100))
      if (shown < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        exitTimer = window.setTimeout(() => {
          setState('exit')
          finishIntro()
          exitTimer = window.setTimeout(() => setState('gone'), 1000)
        }, 250)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(exitTimer)
    }
  }, [])

  if (state === 'gone') return null
  return (
    <div className={`loader ${state === 'exit' ? 'exit' : ''}`} aria-hidden="true">
      <div className="loader-top wrap">
        <span className="loader-mark">ab.</span>
        <span className="label">Portfolio · v2</span>
      </div>
      <div className="loader-mid wrap">
        <p className="loader-line">
          {site.caption.split(' ').map((w, k) => (
            <span key={k} style={{ '--k': k } as React.CSSProperties}>{w}</span>
          ))}
        </p>
      </div>
      <div className="loader-bottom wrap">
        <span className="loader-count">{String(pct).padStart(3, '0')}</span>
        <span className="label">{site.name} · {site.location}</span>
      </div>
      <div className="loader-bar" style={{ transform: `scaleX(${pct / 100})` }} />
    </div>
  )
}
