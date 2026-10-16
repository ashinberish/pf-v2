// Coordinates the intro loader with the hero animations.
// index.html adds `loading` to <html> before paint; the loader removes it when it exits.

const EVENT = 'intro:done'

export const isIntroPending = () => document.documentElement.classList.contains('loading')

export const finishIntro = () => {
  if (!isIntroPending()) return
  document.documentElement.classList.remove('loading')
  window.dispatchEvent(new Event(EVENT))
}

// Calls `cb` once the intro has finished (immediately if it already has). Returns an unsubscribe.
export const onIntroDone = (cb: () => void) => {
  if (!isIntroPending()) {
    cb()
    return () => {}
  }
  window.addEventListener(EVENT, cb, { once: true })
  return () => window.removeEventListener(EVENT, cb)
}
