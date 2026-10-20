import { useEffect, useMemo, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"
import { buildReelUrl, cutAt, reelCuts } from "../lib/reel"
import { formatTimecode } from "../lib/timecode"
import { getCloudinaryVideoPoster } from "../lib/cloudinary"

// A program monitor: one silent spliced reel of real cuts, with the editor's readouts around it.
export function HeroReel({ projects, videoMode, copy, onOpen, onCut }) {
  const videoRef = useRef(null)
  const reduced = useReducedMotion()
  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)
  const lastCut = useRef(-1)
  const src = useMemo(() => buildReelUrl(projects, videoMode), [projects, videoMode])
  const cut = cutAt(time)
  const project = projects.find((item) => item.id === cut.id)
  const firstProject = projects.find((item) => item.id === reelCuts[0].id)
  const poster = firstProject ? getCloudinaryVideoPoster(firstProject.videoSrc, videoMode, reelCuts[0].in) : undefined

  useEffect(() => {
    const video = videoRef.current
    if (!video || reduced) return
    let frame = 0
    const tick = () => { setTime(video.currentTime); frame = requestAnimationFrame(tick) }
    const start = () => { setPlaying(true); cancelAnimationFrame(frame); frame = requestAnimationFrame(tick) }
    const stop = () => { setPlaying(false); cancelAnimationFrame(frame) }
    video.addEventListener("playing", start)
    video.addEventListener("pause", stop)
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !document.hidden) video.play().catch(() => {})
      else video.pause()
    }, { threshold: 0.15 })
    observer?.observe(video)
    const onVisibility = () => { if (document.hidden) video.pause() }
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      video.removeEventListener("playing", start)
      video.removeEventListener("pause", stop)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [reduced, src])

  useEffect(() => {
    if (lastCut.current !== -1 && lastCut.current !== cut.index) onCut?.(cut.index)
    lastCut.current = cut.index
  }, [cut.index, onCut])

  if (!src) return null

  return (
    <figure className="reel" data-playing={playing}>
      <figcaption className="reel-bar reel-bar--top" aria-hidden="true">
        <span className="reel-rec"><span className="reel-dot" />PGM</span>
        <span className="reel-clip">{project?.title}</span>
      </figcaption>
      <button type="button" className="reel-frame" data-cursor="project" onClick={(event) => project && onOpen(project.id, event.currentTarget)} aria-label={`${copy.watchCut}: ${project?.title ?? ""}`}>
        {!failed && <video ref={videoRef} src={src} poster={poster} muted loop playsInline autoPlay={!reduced} preload={reduced ? "none" : "auto"} aria-hidden="true" tabIndex={-1} onError={() => setFailed(true)} />}
        {failed && poster && <img src={poster} alt="" />}
        <span className="reel-safe" aria-hidden="true" />
      </button>
      <div className="reel-bar reel-bar--bottom" aria-hidden="true">
        <span className="reel-tc">{formatTimecode(time)}</span>
        <span className="reel-cuts">
          {reelCuts.map((item, index) => <span key={item.id} className="reel-cut" data-active={index === cut.index} style={{ flexGrow: item.length }} />)}
        </span>
        <span className="reel-count">{String(cut.index + 1).padStart(2, "0")}/{String(reelCuts.length).padStart(2, "0")}</span>
      </div>
    </figure>
  )
}
