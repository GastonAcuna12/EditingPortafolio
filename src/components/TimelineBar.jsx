import { useEffect, useRef, useState } from "react"
import { FPS, formatTimecode } from "../lib/timecode"
import { play } from "../lib/sound"
import { useSound } from "../hooks/useSound"

// The page read as a sequence: every section is a clip on V1, scroll is the playhead.
// One pixel of scroll is one frame, so the timecode is the page's own running time.
export function TimelineBar({ sections, copy }) {
  const [layout, setLayout] = useState({ clips: [], total: 1, height: 1 })
  const [position, setPosition] = useState(0)
  const frame = useRef(0)
  const trackRef = useRef(null)
  const lastClip = useRef(null)
  const [soundOn, toggleSound] = useSound()
  const [ended, setEnded] = useState(false)

  // The sequence ends where the credits begin: the bar fades out with the page.
  useEffect(() => {
    const credits = document.querySelector(".footer-credits")
    if (!credits || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(([entry]) => setEnded(entry.isIntersecting), { threshold: 0.2 })
    observer.observe(credits)
    return () => observer.disconnect()
  }, [])

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

  // Crossing into another section is a cut.
  useEffect(() => {
    if (!current) return
    if (lastClip.current && lastClip.current !== current.id) play("cut")
    lastClip.current = current.id
  }, [current])

  // Grab the playhead: dragging along the track scrubs the page.
  function scrub(event) {
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
    const target = ratio * layout.height
    // Invert the head mapping (head = scroll + viewport * scroll / max) to find the scroll position.
    window.scrollTo({ top: target / (1 + window.innerHeight / layout.total), behavior: "instant" })
  }

  // A press on a clip is a click (jump to it); moving a few pixels turns it into a scrub.
  function onPointerDown(event) {
    if (event.button !== 0) return
    event.currentTarget.dataset.pressX = String(event.clientX)
  }

  function onPointerMove(event) {
    const track = event.currentTarget
    if (track.dataset.pressX === undefined) return
    if (track.dataset.scrubbing !== "true") {
      if (Math.abs(event.clientX - Number(track.dataset.pressX)) < 4) return
      track.setPointerCapture(event.pointerId)
      track.dataset.scrubbing = "true"
    }
    scrub(event)
  }

  function endScrub(event) {
    delete event.currentTarget.dataset.pressX
    delete event.currentTarget.dataset.scrubbing
  }

  function jump(id) {
    const target = document.getElementById(id)
    if (!target) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    target.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" })
    window.history.pushState(null, "", `#${id}`)
  }

  return (
    <nav className="timeline" data-ended={ended} aria-label={copy.label} style={{ "--progress": head / layout.height }}>
      <span className="timeline-tc" aria-hidden="true">{formatTimecode(position / FPS)}</span>
      <div className="timeline-track" ref={trackRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endScrub} onPointerCancel={endScrub}>
        {layout.clips.map((clip) => (
          <button key={clip.id} type="button" className="timeline-clip" data-active={current?.id === clip.id} data-played={head >= clip.end} style={{ left: `${clip.start / layout.height * 100}%`, width: `${(clip.end - clip.start) / layout.height * 100}%` }} onClick={() => jump(clip.id)} onPointerEnter={() => play("tick")} aria-current={current?.id === clip.id ? "location" : undefined}>
            <span>{clip.label}</span>
          </button>
        ))}
        <span className="timeline-playhead" aria-hidden="true"><span className="timeline-grip" /></span>
      </div>
      <button type="button" className="sound-toggle" data-on={soundOn} onClick={toggleSound} aria-pressed={soundOn} aria-label={copy.sound} title={copy.sound}>
        <span className="sound-state" aria-hidden="true">{soundOn ? copy.soundOn : copy.soundOff}</span>
      </button>
    </nav>
  )
}
