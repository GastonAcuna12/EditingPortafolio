import { useEffect } from "react"
import Lenis from "lenis"

export function useSmoothScroll(disabled) {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)")
    let lenis = null
    let frame = 0
    const scrollTo = (event) => lenis?.scrollTo(event.detail, { offset: -72 })
    const raf = (time) => { lenis?.raf(time); frame = requestAnimationFrame(raf) }
    const update = () => {
      if (disabled || media.matches) {
        cancelAnimationFrame(frame)
        lenis?.destroy()
        lenis = null
      } else if (!lenis) {
        lenis = new Lenis({ duration: 1.05, anchors: true, smoothWheel: true })
        frame = requestAnimationFrame(raf)
      }
    }
    window.addEventListener("portfolio:scroll", scrollTo)
    media.addEventListener("change", update)
    update()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("portfolio:scroll", scrollTo)
      media.removeEventListener("change", update)
      lenis?.destroy()
    }
  }, [disabled])
}
