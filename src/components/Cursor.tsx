import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../motion'

// Dot + trailing ring cursor for fine pointers. Elements can set `data-cursor="Label"`
// to show a label inside the ring; links and buttons enlarge it.
export const Cursor = () => {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return
    const root = document.documentElement
    root.classList.add('has-cursor')
    const d = dot.current!
    const r = ring.current!
    const l = label.current!
    let x = -100, y = -100, rx = -100, ry = -100
    let raf = 0

    const loop = () => {
      rx += (x - rx) * 0.18
      ry += (y - ry) * 0.18
      d.style.transform = `translate(${x}px, ${y}px)`
      r.style.transform = `translate(${rx}px, ${ry}px)`
      raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.1 ? requestAnimationFrame(loop) : 0
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x = e.clientX
      y = e.clientY
      root.classList.add('cursor-on')
      const target = (e.target as Element).closest<HTMLElement>('[data-cursor], a, button')
      const text = target?.dataset.cursor ?? ''
      root.classList.toggle('cursor-hover', !!target)
      root.classList.toggle('cursor-label', !!text)
      if (l.textContent !== text) l.textContent = text
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const onLeave = () => root.classList.remove('cursor-on')
    const onDown = () => root.classList.add('cursor-down')
    const onUp = () => root.classList.remove('cursor-down')

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    return () => {
      cancelAnimationFrame(raf)
      root.classList.remove('has-cursor', 'cursor-on', 'cursor-hover', 'cursor-label', 'cursor-down')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  return (
    <>
      <div className="cursor-ring" ref={ring} aria-hidden="true"><span ref={label} /></div>
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
    </>
  )
}
