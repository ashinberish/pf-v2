export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const easeOutCubic = (k: number) => 1 - Math.pow(1 - k, 3)
