import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../motion'

const INTERACTIVE = 'a, button'
const TEXT = 'p, h1, h2, h3, dt, dd, time, figcaption'
// Interactive elements bigger than this keep the plain pointer (iPadOS does the same).
const MAX_SNAP = { w: 420, h: 120 }
const PAD = { x: 10, y: 6 }
const DOT = 18

type Mode = 'dot' | 'snap' | 'text'

// iPadOS-style pointer for fine pointers: a translucent disc that morphs into the shape of
// the button under it, nudging the button toward the pointer, and turns into an I-beam over
// text. Colour follows the nearest `[data-surface]`: ink on orange, paper on dark.
export const Cursor = () => {
  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return
    const root = document.documentElement
    const c = el.current!
    let px = 0, py = 0 // pointer
    let x = 0, y = 0, w = DOT, h = DOT // drawn box (centre + size)
    let mode: Mode = 'dot'
    let snapEl: HTMLElement | null = null
    let textSize = 20
    let raf = 0
    let last = 0
    let seen = false

    const release = () => {
      if (snapEl) snapEl.style.translate = ''
      snapEl = null
    }

    const loop = (t: number) => {
      const dt = Math.min(4, (t - (last || t - 16.7)) / 16.7)
      last = t
      let tx = px, ty = py, tw = DOT, th = DOT, radius = DOT / 2

      if (mode === 'snap' && snapEl) {
        // measure without our own nudge applied
        const r = snapEl.getBoundingClientRect()
        const [ox, oy] = (snapEl.style.translate || '0px 0px').split(' ').map(parseFloat)
        const cx = r.left - (ox || 0) + r.width / 2
        const cy = r.top - (oy || 0) + r.height / 2
        // pointer pulls the button (and its highlight) a few px toward it
        const nx = Math.max(-1, Math.min(1, (px - cx) / (r.width / 2))) * 4
        const ny = Math.max(-1, Math.min(1, (py - cy) / (r.height / 2))) * 3
        snapEl.style.translate = `${nx.toFixed(2)}px ${ny.toFixed(2)}px`
        tx = cx + nx * 1.6
        ty = cy + ny * 1.6
        tw = r.width + PAD.x * 2
        th = r.height + PAD.y * 2
        const br = parseFloat(getComputedStyle(snapEl).borderTopLeftRadius) || 0
        radius = Math.min(br ? br + PAD.y : 12, th / 2)
      } else if (mode === 'text') {
        tw = 2.5
        th = textSize
        radius = 2
      }

      const k = 1 - Math.pow(mode === 'dot' ? 0.45 : 0.6, dt)
      x += (tx - x) * k
      y += (ty - y) * k
      w += (tw - w) * k
      h += (th - h) * k
      c.style.transform = `translate3d(${x - w / 2}px, ${y - h / 2}px, 0)`
      c.style.width = `${w}px`
      c.style.height = `${h}px`
      c.style.borderRadius = `${radius}px`

      const settled = Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(tw - w) + Math.abs(th - h) < 0.2
      // keep running while snapped so the highlight tracks scrolling and the nudge
      if (!settled || mode === 'snap') raf = requestAnimationFrame(loop)
      else raf = last = 0
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop)
    }

    const sense = (target: Element | null) => {
      const hit = target?.closest<HTMLElement>(INTERACTIVE)
      const rect = hit?.getBoundingClientRect()
      const snappable = hit && rect && rect.width <= MAX_SNAP.w && rect.height <= MAX_SNAP.h
      if (snappable) {
        if (snapEl !== hit) release()
        snapEl = hit
        mode = 'snap'
      } else {
        release()
        const text = !hit && target?.closest<HTMLElement>(TEXT)
        if (text) {
          mode = 'text'
          textSize = Math.max(16, Math.min(64, parseFloat(getComputedStyle(text).fontSize) * 1.05))
        } else {
          mode = 'dot'
        }
      }
      c.dataset.mode = mode
      c.dataset.surface = target?.closest('[data-surface]')?.getAttribute('data-surface') === 'light' ? 'light' : 'dark'
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      px = e.clientX
      py = e.clientY
      if (!seen) {
        seen = true
        x = px
        y = py
        root.classList.add('has-cursor')
      }
      c.classList.add('on')
      sense(e.target as Element)
      kick()
    }
    // Content moves under a still pointer while scrolling, so re-check what is beneath it.
    const onScroll = () => {
      if (!seen) return
      sense(document.elementFromPoint(px, py))
      kick()
    }
    const hide = () => {
      c.classList.remove('on')
      release()
      mode = 'dot'
    }
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
      release()
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      root.removeEventListener('mouseleave', hide)
      window.removeEventListener('blur', hide)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  return <div className="cursor" ref={el} data-mode="dot" data-surface="dark" aria-hidden="true" />
}
