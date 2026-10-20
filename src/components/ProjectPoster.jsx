import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Play } from "lucide-react"
import { getCloudinaryVideoPoster, getCloudinaryPosterSrcSet, getCloudinaryPreview } from "../lib/cloudinary"
import { resolveEase } from "../lib/motion"
import { formatTimecode } from "../lib/timecode"

function HoverPreview({ project }) {
  const ref = useRef(null)
  const [live, setLive] = useState(false)
  const [time, setTime] = useState(0)
  const start = project.posterSecond ?? 1
  useEffect(() => {
    const video = ref.current
    video?.play().catch(() => {})
    return () => video?.pause()
  }, [])
  return (
    <>
      <video ref={ref} className="project-preview" data-live={live} src={getCloudinaryPreview(project.videoSrc, start, 5)} muted loop playsInline autoPlay preload="auto" aria-hidden="true" tabIndex={-1} onPlaying={() => setLive(true)} onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)} />
      <span className="project-tc" data-live={live} aria-hidden="true">{formatTimecode(start + time)}</span>
    </>
  )
}

export function ProjectPoster({ project, videoMode, eager = false, label, previewing = false, sizes = "(max-width: 639px) calc(100vw - 40px), 420px" }) {
  const [failed, setFailed] = useState(false)
  const reduced = useReducedMotion()
  const image = !failed && <img src={getCloudinaryVideoPoster(project.videoSrc, videoMode, project.posterSecond ?? 1)} srcSet={getCloudinaryPosterSrcSet(project.videoSrc, project.posterSecond ?? 1)} sizes={sizes} alt="" width="540" height="960" loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} decoding="async" onError={() => setFailed(true)} />
  return (
    <motion.div className="project-cover" initial={reduced ? false : { opacity: 0, scale: .99 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: .06 }} transition={{ duration: reduced ? 0 : .38, ease: resolveEase }}>
      {image}
      {previewing && !reduced && !failed && <HoverPreview project={project} />}
      {failed && <span className="poster-fallback">{project.title}</span>}
      <span className="project-watch"><Play size={15} fill="currentColor" aria-hidden="true" /><span>{label}</span></span>
    </motion.div>
  )
}
