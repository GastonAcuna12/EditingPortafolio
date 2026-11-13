import { useEffect, useRef } from "react"
import { getOptimizedCloudinaryVideo, getCloudinaryVideoPoster } from "../lib/cloudinary"
import { RATIOS } from "../lib/formats"

// Every delivered size of one ad, playing together and muted, so the resize work reads at a glance.
// The videos start together once all of them can play, and restart together when the longest one ends.
export function FormatSet({ formats, posterSecond = 1, videoMode, label }) {
  const refs = useRef([])
  useEffect(() => {
    const videos = refs.current.filter(Boolean)
    let started = false
    const start = () => {
      if (started || !videos.every((video) => video.readyState >= 3)) return
      started = true
      videos.forEach((video) => { video.currentTime = 0; video.play().catch(() => {}) })
    }
    const restart = () => videos.forEach((video) => { video.currentTime = 0; video.play().catch(() => {}) })
    videos.forEach((video) => video.addEventListener("canplay", start))
    const longest = videos.reduce((a, b) => ((b.duration || 0) > (a?.duration || 0) ? b : a), videos[0])
    longest?.addEventListener("ended", restart)
    start()
    return () => {
      videos.forEach((video) => { video.removeEventListener("canplay", start); video.pause() })
      longest?.removeEventListener("ended", restart)
    }
  }, [formats])
  return (
    <ul className="format-set" aria-label={label}>
      {formats.map(([ratio, src], index) => (
        <li key={ratio} style={{ "--ar": RATIOS[ratio] }}>
          <video ref={(node) => { refs.current[index] = node }} src={getOptimizedCloudinaryVideo(src, videoMode, ratio === "16:9")} poster={getCloudinaryVideoPoster(src, videoMode, posterSecond)} muted playsInline preload="auto" aria-hidden="true" />
          <span>{ratio}</span>
        </li>
      ))}
    </ul>
  )
}
