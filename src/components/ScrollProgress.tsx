import { useEffect, useRef } from 'react'

export const ScrollProgress = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const k = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)
      ref.current!.style.transform = `scaleX(${k})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return <div className="progress" ref={ref} aria-hidden="true" />
}
