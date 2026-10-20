import { useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Play } from "lucide-react"
import { getCloudinaryVideoPoster, getCloudinaryPosterSrcSet } from "../lib/cloudinary"
import { resolveEase } from "../lib/motion"

export function ProjectPoster({ project, videoMode, eager = false, label, sizes = "(max-width: 639px) calc(100vw - 40px), 420px" }) {
  const [failed, setFailed] = useState(false)
  const reduced = useReducedMotion()
  const image = !failed && <img src={getCloudinaryVideoPoster(project.videoSrc, videoMode, project.posterSecond ?? 1)} srcSet={getCloudinaryPosterSrcSet(project.videoSrc, project.posterSecond ?? 1)} sizes={sizes} alt="" width="540" height="960" loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} decoding="async" onError={() => setFailed(true)} />
  return (
    <motion.div className="project-cover" initial={reduced ? false : { opacity: 0, scale: .99 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: .06 }} transition={{ duration: reduced ? 0 : .38, ease: resolveEase }}>
      {image}
      {failed && <span className="poster-fallback">{project.title}</span>}
      <span className="project-watch"><Play size={15} fill="currentColor" aria-hidden="true" /><span>{label}</span></span>
    </motion.div>
  )
}
