import { useState } from "react"
import { Play } from "lucide-react"
import { getCloudinaryVideoPoster, getCloudinaryPosterSrcSet } from "../lib/cloudinary"

export function ProjectPoster({ project, videoMode, eager = false, label, sizes = "(max-width: 639px) calc(100vw - 40px), 420px" }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="project-cover">
      {!failed && <img src={getCloudinaryVideoPoster(project.videoSrc, videoMode, project.posterSecond ?? 1)} srcSet={getCloudinaryPosterSrcSet(project.videoSrc, project.posterSecond ?? 1)} sizes={sizes} alt="" width="540" height="960" loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} decoding="async" onError={() => setFailed(true)} />}
      {failed && <span className="poster-fallback">{project.title}</span>}
      <span className="project-watch"><Play size={15} fill="currentColor" aria-hidden="true" /><span>{label}</span></span>
    </div>
  )
}
