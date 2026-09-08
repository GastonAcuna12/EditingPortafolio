import { useLayoutEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"

const easing = "cubic-bezier(.22,1,.36,1)"

function visible(rect) {
  return rect && rect.width > 0 && rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth
}

function flyPoster(image, from, to, duration) {
  Object.assign(image.style, {
    left: `${to.left}px`, top: `${to.top}px`, width: `${to.width}px`, height: `${to.height}px`, visibility: "visible",
  })
  return image.animate([
    { transform: `translate3d(${from.left - to.left}px, ${from.top - to.top}px, 0) scale(${from.width / to.width})` },
    { transform: "translate3d(0, 0, 0) scale(1)" },
  ], { duration, easing, fill: "both" })
}

export function useProjectTransition({ dialogRef, frameRef, flightRef, surfaceRef, backdropRef, origin, projectId, closing, onClosed }) {
  const [ready, setReady] = useState(false)
  const reduced = useReducedMotion()
  const initialOrigin = useRef(origin)
  const animations = useRef([])

  useLayoutEffect(() => {
    const dialog = dialogRef.current
    const overflow = document.body.style.overflow
    const restoration = window.history.scrollRestoration
    const scroll = { top: window.scrollY, left: window.scrollX }
    dialog.showModal()
    document.body.style.overflow = "hidden"
    window.history.scrollRestoration = "manual"
    return () => {
      dialog.close()
      document.body.style.overflow = overflow
      window.history.scrollRestoration = restoration
      window.scrollTo({ ...scroll, behavior: "instant" })
    }
  }, [dialogRef])

  useLayoutEffect(() => {
    let disposed = false
    const flight = flightRef.current
    const frame = frameRef.current
    const from = initialOrigin.current?.rect
    const to = frame.getBoundingClientRect()
    const shared = !reduced && from && visible(to)
    const duration = reduced ? 0 : shared ? 620 : 220
    frame.style.opacity = shared ? "0" : "1"
    const entering = [
      backdropRef.current.animate([{ opacity: 0 }, { opacity: 1 }], { duration, easing, fill: "both" }),
      surfaceRef.current.animate([{ opacity: 0 }, { opacity: 1 }], { duration: reduced ? 0 : 320, delay: shared ? 180 : 0, easing, fill: "both" }),
    ]
    if (shared) entering.push(flyPoster(flight, from, to, duration))
    animations.current = entering
    // Resize invalidates the measured destination; settle into the responsive frame.
    const settle = () => entering.forEach((animation) => animation.finish())
    window.addEventListener("resize", settle)
    Promise.all(entering.map((animation) => animation.finished)).then(() => {
      if (disposed) return
      window.removeEventListener("resize", settle)
      frame.style.opacity = "1"
      flight.style.visibility = "hidden"
      setReady(true)
    }).catch(() => {})
    return () => {
      disposed = true
      window.removeEventListener("resize", settle)
      entering.forEach((animation) => animation.cancel())
    }
  }, [reduced, backdropRef, surfaceRef, frameRef, flightRef])

  useLayoutEffect(() => {
    if (!closing) return
    let disposed = false
    animations.current.forEach((animation) => animation.cancel())
    const frame = frameRef.current
    const flight = flightRef.current
    const from = frame.getBoundingClientRect()
    const target = document.querySelector(`[data-project-id="${CSS.escape(projectId)}"] .project-cover`)
    const to = target?.getBoundingClientRect()
    const shared = !reduced && ready && visible(from) && visible(to)
    const duration = reduced ? 0 : shared ? 420 : 220
    flight.style.visibility = "hidden"
    frame.style.opacity = shared ? "0" : "1"
    const leaving = [
      backdropRef.current.animate([{ opacity: 1 }, { opacity: 0 }], { duration, easing, fill: "both" }),
      surfaceRef.current.animate([{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: reduced ? "none" : "translateY(6px)" }], { duration, easing, fill: "both" }),
    ]
    if (shared) leaving.push(flyPoster(flight, from, to, duration))
    const settle = () => leaving.forEach((animation) => animation.finish())
    window.addEventListener("resize", settle)
    Promise.all(leaving.map((animation) => animation.finished)).then(() => {
      if (!disposed) onClosed()
    }).catch(() => {})
    return () => {
      disposed = true
      window.removeEventListener("resize", settle)
      leaving.forEach((animation) => animation.cancel())
      frame.style.opacity = "1"
      flight.style.visibility = "hidden"
    }
  }, [closing, ready, reduced, projectId, onClosed, backdropRef, surfaceRef, frameRef, flightRef])

  return ready
}
