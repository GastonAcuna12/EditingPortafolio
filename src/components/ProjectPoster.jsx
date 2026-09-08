import { useState } from "react"
import { Play } from "lucide-react"
import { getCloudinaryVideoPoster } from "../lib/cloudinary"

export function ProjectPoster({ project, videoMode, eager = false, label }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="project-cover">
      {!failed && <img src={getCloudinaryVideoPoster(project.videoSrc, videoMode, project.posterSecond ?? 1)} alt="" width="540" height="960" loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} decoding="async" onError={() => setFailed(true)} />}
      {failed && <span className="poster-fallback">{project.title}</span>}
      <span className="project-watch"><Play size={15} fill="currentColor" aria-hidden="true" /><span>{label}</span></span>
    </div>
  )
}
