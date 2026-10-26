import { useEffect, useMemo, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"
import { ArrowDown } from "lucide-react"
import { buildReelUrl, reelCuts } from "../lib/reel"
import { getCloudinaryVideoPoster } from "../lib/cloudinary"

function TriptychPanel({ projects, videoMode, index, active, masterRef }) {
  const videoRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [failed, setFailed] = useState(false)
  const cuts = useMemo(() => reelCuts.map((_, position) => ({ ...reelCuts[(position + index * 2) % reelCuts.length], length: 1.15 })), [index])
  const url = useMemo(() => buildReelUrl(projects, videoMode, cuts), [projects, videoMode, cuts])
  const first = projects.find((item) => item.id === cuts[0].id)
  const poster = first && getCloudinaryVideoPoster(first.videoSrc, videoMode, cuts[0].in)

  useEffect(() => {
    if (!active || !videoRef.current || typeof IntersectionObserver === "undefined") return
    const video = videoRef.current
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting)
      if (entry.isIntersecting && !document.hidden) video.play().catch(() => {})
      else video.pause()
    }, { rootMargin: "400px 0px", threshold: .05 })
    observer.observe(video)
    const onVisibility = () => { if (document.hidden) video.pause(); else if (visible) video.play().catch(() => {}) }
    document.addEventListener("visibilitychange", onVisibility)
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", onVisibility) }
  }, [active, visible])

  useEffect(() => {
    if (index === 0 || !active || !visible) return
    const video = videoRef.current
    const source = masterRef.current
    if (!video || !source) return
    const sync = () => {
      if (Math.abs(video.currentTime - source.currentTime) > .16) video.currentTime = source.currentTime
    }
    source.addEventListener("timeupdate", sync)
    return () => source.removeEventListener("timeupdate", sync)
  }, [active, index, masterRef, visible])

  return <div className="triptych-panel" aria-hidden="true">
    {poster && <img src={poster} alt="" loading={index ? "lazy" : "eager"} />}
    {active && !failed && <video ref={(node) => { videoRef.current = node; if (index === 0) masterRef.current = node }} src={visible ? url : undefined} muted loop playsInline preload="none" onError={() => setFailed(true)} />}
  </div>
}

export function Hero({ copy, projects, videoMode }) {
  const reduced = useReducedMotion()
  const masterRef = useRef(null)
  const panels = videoMode === "mobile" ? [0] : [0, 1, 2]
  return <section id="top" className="hero" aria-labelledby="hero-title">
    <div className="hero-triptych">
      {panels.map((index) => <TriptychPanel key={index} projects={projects} videoMode={videoMode} index={index} active={!reduced} masterRef={masterRef} />)}
    </div>
    <div className="hero-stage shell">
      <h1 id="hero-title"><span className="hero-main">{copy.lines[0].split(" ").map((word, index) => <span className="hero-word" key={index} style={{ "--word": index }}>{word}</span>)}</span><span className="hero-italic">{copy.lines[1]}</span></h1>
      <div className="hero-bottom"><span>{copy.role}<br />{copy.city}</span><span>{copy.availability}</span><a className="text-link" href="#work">{copy.cta}<ArrowDown size={19} aria-hidden="true" /></a></div>
    </div>
  </section>
}
