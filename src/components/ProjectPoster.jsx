import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"
import { Play } from "lucide-react"
import { getCloudinaryVideoPoster, getCloudinaryPosterSrcSet, getCloudinaryPreview } from "../lib/cloudinary"

function HoverPreview({ project }) {
  const ref = useRef(null)
  const [live, setLive] = useState(false)
  const start = project.posterSecond ?? 1
  useEffect(() => {
    const video = ref.current
    video?.play().catch(() => {})
    return () => video?.pause()
  }, [])
  return (
    <video ref={ref} className="project-preview" data-live={live} src={getCloudinaryPreview(project.videoSrc, start, 5)} muted loop playsInline autoPlay preload="auto" aria-hidden="true" tabIndex={-1} onPlaying={() => setLive(true)} />
  )
}

export function ProjectPoster({ project, videoMode, eager = false, label, previewing = false, sizes = "(max-width: 639px) calc(100vw - 40px), 420px" }) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [placeholderLoaded, setPlaceholderLoaded] = useState(false)
  const reduced = useReducedMotion()
  const second = project.posterSecond ?? 1
  const placeholder = getCloudinaryVideoPoster(project.videoSrc, videoMode, second, 24)
  const image = !failed && <img className="project-poster" data-loaded={loaded} src={getCloudinaryVideoPoster(project.videoSrc, videoMode, second)} srcSet={getCloudinaryPosterSrcSet(project.videoSrc, second)} sizes={sizes} alt="" width="540" height="960" loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} decoding="async" onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />
  return (
    <div className="project-cover">
      {!loaded && !placeholderLoaded && <span className="poster-fallback">{project.title}</span>}
      {placeholder && !failed && <img className="project-placeholder" src={placeholder} alt="" aria-hidden="true" decoding="async" onLoad={() => setPlaceholderLoaded(true)} />}
      {image}
      {previewing && !reduced && !failed && <HoverPreview project={project} />}
      {failed && placeholderLoaded && <span className="poster-fallback">{project.title}</span>}
      <span className="project-watch"><Play size={15} fill="currentColor" aria-hidden="true" /><span>{label}</span></span>
    </div>
  )
}
