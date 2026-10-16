import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../motion'

const INTERACTIVE = '[data-cursor], a, button'

// Single-disc cursor for fine pointers. It squashes along the direction of travel,
// opens into a ring over links, and grows into a labelled disc over `[data-cursor]`.
// Colour follows the nearest `[data-surface]`: ink on orange, orange on dark.
export const Cursor = () => {
  const el = useRef<HTMLDivElement>(null)
  const ball = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return
    const root = document.documentElement
    const c = el.current!
    const b = ball.current!
    const l = label.current!
    let x = 0, y = 0, cx = 0, cy = 0
    let raf = 0
    let last = 0
    let seen = false

    const loop = (t: number) => {
      const dt = Math.min(4, (t - (last || t - 16.7)) / 16.7)
      last = t
      const k = 1 - Math.pow(0.62, dt)
      const vx = (x - cx) * k
      const vy = (y - cy) * k
      cx += vx
      cy += vy
      c.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
      // squash and stretch with speed, only for the plain dot
      const speed = Math.min(Math.hypot(vx, vy) / dt, 60)
      const s = c.dataset.state === 'dot' ? speed / 160 : 0
      b.style.transform = `rotate(${Math.atan2(vy, vx)}rad) scale(${1 + s}, ${1 - s})`
      if (Math.abs(x - cx) + Math.abs(y - cy) > 0.1) raf = requestAnimationFrame(loop)
      else raf = last = 0
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop)
    }

    // Work out state and colour from whatever is under the pointer.
    const sense = (target: Element | null) => {
      const hit = target?.closest<HTMLElement>(INTERACTIVE)
      const text = hit?.dataset.cursor ?? ''
      c.dataset.state = text ? 'label' : hit ? 'link' : 'dot'
      c.dataset.surface = target?.closest('[data-surface]')?.getAttribute('data-surface') === 'light' ? 'light' : 'dark'
      if (l.textContent !== text) l.textContent = text
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x = e.clientX
      y = e.clientY
      if (!seen) {
        seen = true
        cx = x
        cy = y
        root.classList.add('has-cursor')
      }
      c.classList.add('on')
      sense(e.target as Element)
      kick()
    }
    // Content moves under a still pointer while scrolling, so re-check what is beneath it.
    const onScroll = () => {
      if (seen) sense(document.elementFromPoint(x, y))
    }
    const hide = () => c.classList.remove('on')
    const onDown = () => c.classList.add('down')
    const onUp = () => c.classList.remove('down')

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    root.addEventListener('mouseleave', hide)
    window.addEventListener('blur', hide)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    return () => {
      cancelAnimationFrame(raf)
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      root.removeEventListener('mouseleave', hide)
      window.removeEventListener('blur', hide)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  return (
    <div className="cursor" ref={el} data-state="dot" data-surface="dark" aria-hidden="true">
      <div className="cursor-ball" ref={ball} />
      <span className="cursor-text" ref={label} />
    </div>
  )
}
