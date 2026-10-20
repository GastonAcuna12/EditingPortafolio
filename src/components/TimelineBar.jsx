import { useEffect, useRef, useState } from "react"
import { FPS, formatTimecode } from "../lib/timecode"

// The page read as a sequence: every section is a clip on V1, scroll is the playhead.
// One pixel of scroll is one frame, so the timecode is the page's own running time.
export function TimelineBar({ sections, copy }) {
  const [layout, setLayout] = useState({ clips: [], total: 1, height: 1 })
  const [position, setPosition] = useState(0)
  const frame = useRef(0)

  useEffect(() => {
    const measure = () => {
      const height = Math.max(1, document.documentElement.scrollHeight)
      const max = Math.max(1, height - window.innerHeight)
      const clips = sections.map(({ id, label }) => {
        const node = document.getElementById(id)
        if (!node) return null
        return { id, label, start: Math.max(0, node.getBoundingClientRect().top + window.scrollY) }
      }).filter(Boolean).sort((a, b) => a.start - b.start)
      clips.forEach((clip, index) => { clip.end = clips[index + 1]?.start ?? height })
      setLayout({ clips, total: max, height })
    }
    const onScroll = () => {
      cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(() => setPosition(window.scrollY))
    }
    measure()
    onScroll()
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure)
    observer?.observe(document.body)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", measure)
    return () => {
      cancelAnimationFrame(frame.current)
      observer?.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", measure)
    }
  }, [sections])

  const progress = Math.min(1, position / layout.total)
  // The playhead travels the whole document: the top of the viewport at the start, its bottom at the end.
  const head = position + window.innerHeight * progress
  const current = [...layout.clips].reverse().find((clip) => head >= clip.start) ?? layout.clips[0]

  function jump(id) {
    const target = document.getElementById(id)
    if (!target) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    target.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" })
    window.history.pushState(null, "", `#${id}`)
  }

  return (
    <nav className="timeline" aria-label={copy.label} style={{ "--progress": head / layout.height }}>
      <span className="timeline-tc" aria-hidden="true">{formatTimecode(position / FPS)}</span>
      <span className="timeline-track-label" aria-hidden="true">V1</span>
      <div className="timeline-track">
        {layout.clips.map((clip) => (
          <button key={clip.id} type="button" className="timeline-clip" data-active={current?.id === clip.id} style={{ left: `${clip.start / layout.height * 100}%`, width: `${(clip.end - clip.start) / layout.height * 100}%` }} onClick={() => jump(clip.id)} aria-current={current?.id === clip.id ? "location" : undefined}>
            <span>{clip.label}</span>
          </button>
        ))}
        <span className="timeline-playhead" aria-hidden="true" />
      </div>
      <span className="timeline-total" aria-hidden="true">{formatTimecode(layout.total / FPS)}</span>
    </nav>
  )
}
