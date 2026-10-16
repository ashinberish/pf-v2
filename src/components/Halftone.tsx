import { useEffect, useRef, useState } from 'react'
import portraitJpg from '../assets/portrait.jpg'
import portraitWebp from '../assets/portrait.webp'
import { onIntroDone } from '../intro'
import { prefersReducedMotion } from '../motion'

type Dot = { x: number; y: number; r: number; dist: number }

// Renders the portrait as a halftone on canvas. The <img> underneath is the
// crawlable, no-JS fallback; the canvas fades in once it has drawn.
export const Halftone = ({ alt }: { alt: string }) => {
  const frame = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const cv = canvas.current!
    const fig = frame.current!
    const ctx = cv.getContext('2d')
    if (!ctx) return
    const reduce = prefersReducedMotion()
    const img = new Image()
    let dots: Dot[] = []
    let step = 8
    let W = 0
    let H = 0
    let start = 0
    let mx = 0
    let my = 0
    let hover = false
    let raf = 0

    const build = () => {
      const rect = cv.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = cv.width = Math.round(rect.width * dpr)
      H = cv.height = Math.round(rect.height * dpr)
      step = Math.max(4, Math.round(4 * dpr))
      const cols = Math.ceil(W / step)
      const rows = Math.ceil(H / step)
      const off = document.createElement('canvas')
      off.width = cols
      off.height = rows
      const o = off.getContext('2d')!
      o.drawImage(img, 0, 0, cols, rows)
      const data = o.getImageData(0, 0, cols, rows).data
      const diag = Math.hypot(W, H)
      dots = []
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const v = Math.min(1, Math.max(0, (data[(y * cols + x) * 4] / 255 - 0.08) * 1.15))
          const px = x * step + step / 2
          const py = y * step + step / 2
          dots.push({ x: px, y: py, r: Math.pow(v, 0.85) * step * 0.6, dist: Math.hypot(px - W * 0.55, py - H * 0.35) / diag })
        }
      }
    }

    const draw = (t: number) => {
      const p = reduce ? 1 : Math.min(1, Math.max(0, (t - start) / 1600))
      ctx.fillStyle = '#0b0b0b'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#f2ece6'
      const radius = step * 6
      for (const d of dots) {
        const local = Math.max(0, Math.min(1, p * 1.6 - d.dist))
        let r = d.r * (1 - Math.pow(1 - local, 3))
        if (hover) {
          const dd = Math.hypot(d.x - mx, d.y - my)
          if (dd < radius) {
            const k = 1 - dd / radius
            r = r * (1 - k * 0.8) + k * step * 0.18
          }
        }
        if (r > 0.35) {
          ctx.beginPath()
          ctx.arc(d.x, d.y, r, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      raf = p < 1 || hover ? requestAnimationFrame(draw) : 0
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw)
    }

    let offIntro = () => {}
    const onLoad = () => {
      build()
      offIntro = onIntroDone(() => {
        start = performance.now() + (reduce ? 0 : 250)
        setReady(true)
        kick()
      })
    }
    const onResize = () => {
      build()
      kick()
    }
    const onMove = (e: PointerEvent) => {
      if (reduce) return
      const rect = cv.getBoundingClientRect()
      mx = (e.clientX - rect.left) * (W / rect.width)
      my = (e.clientY - rect.top) * (H / rect.height)
      hover = true
      kick()
    }
    const onLeave = () => {
      hover = false
      kick()
    }

    img.addEventListener('load', onLoad)
    img.src = portraitJpg
    window.addEventListener('resize', onResize)
    fig.addEventListener('pointermove', onMove)
    fig.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      offIntro()
      img.removeEventListener('load', onLoad)
      window.removeEventListener('resize', onResize)
      fig.removeEventListener('pointermove', onMove)
      fig.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <figure className="portrait" ref={frame} data-cursor="Move">
      <picture>
        <source srcSet={portraitWebp} type="image/webp" />
        <img src={portraitJpg} alt={alt} width={600} height={716} decoding="async" {...{ fetchpriority: "high" }} />
      </picture>
      <canvas ref={canvas} className={ready ? 'ready' : undefined} aria-hidden="true" />
      <figcaption className="tag label">Chennai · IN</figcaption>
    </figure>
  )
}
