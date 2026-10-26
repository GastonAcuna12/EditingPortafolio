import { useEffect, useRef } from "react"
import { useReducedMotion } from "motion/react"

export function DisciplineStrip({ copy }) {
  const section = useRef(null)
  const line = useRef(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (!section.current || !line.current) return
        const rect = section.current.getBoundingClientRect()
        const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)))
        line.current.style.transform = `translate3d(${-progress * 24}%,0,0)`
      })
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); window.removeEventListener("resize", update) }
  }, [reduced])
  return <div ref={section} className="discipline-strip" aria-label={copy.join(" · ")}>
    <div ref={line} className="discipline-line" aria-hidden="true">{[0, 1, 2].map((repeat) => copy.map((item, index) => <span key={`${repeat}-${item}`} className={index % 2 ? "discipline-outline" : ""}>{item}<b>·</b></span>))}</div>
  </div>
}
