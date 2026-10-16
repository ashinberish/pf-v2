import { useEffect, useRef, useState } from 'react'
import portraitJpg from '../assets/portrait.jpg'
import portraitWebp from '../assets/portrait.webp'
import { onIntroDone } from '../intro'
import { prefersReducedMotion } from '../motion'

type Dot = { x: number; y: number; r: number; dist: number }

// Opening effect: the portrait builds up as halftone dots on a canvas, then the canvas
// fades away to reveal the plain photo. The <img> is the real, crawlable image.
export const Halftone = ({ alt }: { alt: string }) => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState<'idle' | 'building' | 'done'>('idle')

  useEffect(() => {
    const cv = canvas.current!
    const ctx = cv.getContext('2d')
    if (!ctx || prefersReducedMotion()) {
      setPhase('done')
      return
    }
    const img = new Image()
    let dots: Dot[] = []
    let step = 8
    let W = 0
    let H = 0
    let start = 0
    let raf = 0
    let fadeTimer = 0

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
      const p = Math.min(1, Math.max(0, (t - start) / 1600))
      ctx.fillStyle = '#0b0b0b'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#f2ece6'
      for (const d of dots) {
        const local = Math.max(0, Math.min(1, p * 1.6 - d.dist))
        const r = d.r * (1 - Math.pow(1 - local, 3))
        if (r > 0.35) {
          ctx.beginPath()
          ctx.arc(d.x, d.y, r, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      if (p < 1) {
        raf = requestAnimationFrame(draw)
      } else {
        raf = 0
        // hold the finished halftone for a beat, then dissolve to the photo
        fadeTimer = window.setTimeout(() => setPhase('done'), 450)
      }
    }

    let offIntro = () => {}
    const onLoad = () => {
      build()
      offIntro = onIntroDone(() => {
        start = performance.now() + 250
        setPhase('building')
        raf = requestAnimationFrame(draw)
      })
    }

    img.addEventListener('load', onLoad)
    img.src = portraitJpg
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(fadeTimer)
      offIntro()
      img.removeEventListener('load', onLoad)
    }
  }, [])

  return (
    <figure className="portrait" data-surface="dark">
      <picture>
        <source srcSet={portraitWebp} type="image/webp" />
        <img src={portraitJpg} alt={alt} width={600} height={716} decoding="async" {...{ fetchpriority: "high" }} />
      </picture>
      <canvas ref={canvas} className={phase} aria-hidden="true" />
      <figcaption className="tag label">Chennai · IN</figcaption>
    </figure>
  )
}
