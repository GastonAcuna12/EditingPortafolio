import { useEffect, useRef } from "react"
import { useReducedMotion } from "motion/react"

// Client logos run as one slow, constant line, like end credits. Every logo is tinted the same
// cream through a CSS mask, so the row reads as one family. The second copy only closes the loop.
const logoUrl = (file) => `${import.meta.env.BASE_URL}clients/${file}`

const CRUISE = -36 // px per second, leftwards
const EASE_BACK = 1.6 // how fast a flick or a pause settles back to cruise, per second
const MAX_FLICK = 2600 // px per second

// Hover slows the row to a stop; pressing holds it; dragging moves it either way, and a flick
// keeps its speed for a moment before easing back to cruise. Vertical page scroll stays native.
function useCreditRoll(trackRef, enabled) {
  useEffect(() => {
    const track = trackRef.current
    const marquee = track?.parentElement
    if (!enabled || !track || !marquee) return

    let offset = 0
    let speed = CRUISE
    let hovering = false
    let pointer = null // { id, x, t, velocity }
    let visible = true
    let frame = 0
    let last = performance.now()

    const loopWidth = () => track.scrollWidth / 2
    const wrap = () => {
      const width = loopWidth()
      if (!width) return
      offset %= width
      if (offset > 0) offset -= width
    }
    const paint = () => { track.style.transform = `translate3d(${offset}px, 0, 0)` }

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (!pointer) {
        const target = hovering ? 0 : CRUISE
        speed += (target - speed) * Math.min(1, dt * EASE_BACK)
        offset += speed * dt
        wrap()
        paint()
      }
      frame = visible ? requestAnimationFrame(tick) : 0
    }
    const start = () => { if (!frame && visible && !document.hidden) { last = performance.now(); frame = requestAnimationFrame(tick) } }
    const stop = () => { cancelAnimationFrame(frame); frame = 0 }

    const onDown = (event) => {
      if (event.button !== 0 && event.pointerType === "mouse") return
      pointer = { id: event.pointerId, x: event.clientX, t: performance.now(), velocity: 0 }
      speed = 0
      marquee.setPointerCapture(event.pointerId)
      marquee.dataset.dragging = "true"
    }
    const onMove = (event) => {
      if (!pointer || event.pointerId !== pointer.id) return
      const now = performance.now()
      const dx = event.clientX - pointer.x
      const dt = Math.max((now - pointer.t) / 1000, 0.001)
      offset += dx
      pointer.velocity = pointer.velocity * 0.6 + (dx / dt) * 0.4
      pointer.x = event.clientX
      pointer.t = now
      wrap()
      paint()
    }
    const onUp = (event) => {
      if (!pointer || event.pointerId !== pointer.id) return
      // A pause before letting go means no flick.
      const held = performance.now() - pointer.t > 90
      speed = held ? 0 : Math.max(-MAX_FLICK, Math.min(MAX_FLICK, pointer.velocity))
      pointer = null
      delete marquee.dataset.dragging
      if (event.pointerType !== "mouse") hovering = false
    }
    const onEnter = (event) => { if (event.pointerType === "mouse") hovering = true }
    const onLeave = (event) => { if (event.pointerType === "mouse") hovering = false }
    const onVisibility = () => { if (document.hidden) stop(); else start() }

    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start(); else stop()
    }, { rootMargin: "200px 0px" })
    observer?.observe(marquee)

    marquee.addEventListener("pointerdown", onDown)
    marquee.addEventListener("pointermove", onMove)
    marquee.addEventListener("pointerup", onUp)
    marquee.addEventListener("pointercancel", onUp)
    marquee.addEventListener("pointerenter", onEnter)
    marquee.addEventListener("pointerleave", onLeave)
    document.addEventListener("visibilitychange", onVisibility)
    start()

    return () => {
      stop()
      observer?.disconnect()
      marquee.removeEventListener("pointerdown", onDown)
      marquee.removeEventListener("pointermove", onMove)
      marquee.removeEventListener("pointerup", onUp)
      marquee.removeEventListener("pointercancel", onUp)
      marquee.removeEventListener("pointerenter", onEnter)
      marquee.removeEventListener("pointerleave", onLeave)
      document.removeEventListener("visibilitychange", onVisibility)
      track.style.transform = ""
    }
  }, [trackRef, enabled])
}

export function FeaturedClients({ clients, copy }) {
  const trackRef = useRef(null)
  const reduced = useReducedMotion()
  useCreditRoll(trackRef, clients.length > 0 && !reduced)
  if (!clients.length) return null
  const logos = (hidden) => (
    <ul className="clients-run" aria-hidden={hidden || undefined}>
      {clients.map((client) => (
        <li key={client.name}>
          <span
            className="client-logo"
            role={hidden ? undefined : "img"}
            aria-label={hidden ? undefined : client.name}
            style={{ "--logo": `url("${logoUrl(client.logo)}")`, "--ratio": client.ratio, "--scale": client.scale ?? 1 }}
          />
        </li>
      ))}
    </ul>
  )
  return (
    <section className="clients-section" aria-labelledby="clients-title">
      <div className="clients-head shell">
        <h2 id="clients-title" className="eyebrow">{copy.label}</h2>
      </div>
      <div className="clients-marquee">
        <div ref={trackRef} className="clients-track">{logos(false)}{logos(true)}</div>
      </div>
    </section>
  )
}
