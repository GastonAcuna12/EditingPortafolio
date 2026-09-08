import { useEffect, useRef, useState } from "react"
import { getCloudinaryVideoPoster, getOptimizedCloudinaryVideo } from "../../lib/cloudinary"

function stopVideo(video, reset = true) {
  video.pause()
  video.muted = true
  if (reset) {
    try { video.currentTime = 0 } catch { /* Metadata may not be available yet. */ }
  }
}

export function CloudinaryVideo({ src, posterSrc, title, videoMode = "desktop", isActive = true, copy }) {
  const videoRef = useRef(null)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const videoSrc = getOptimizedCloudinaryVideo(src, videoMode)
  const poster = posterSrc || getCloudinaryVideoPoster(src, videoMode, 1)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (!isActive) stopVideo(video)
    else video.muted = false
    return () => stopVideo(video)
  }, [isActive, videoSrc, attempt])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onVisibility = () => { if (document.hidden) stopVideo(video, false) }
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) stopVideo(video, false)
    }, { threshold: 0.08 })
    observer?.observe(video)
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      observer?.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      stopVideo(video)
    }
  }, [attempt, videoSrc])

  function handlePlay(event) {
    const current = event.currentTarget
    if (!isActive || document.hidden) return stopVideo(current)
    current.muted = false
    document.querySelectorAll("video[data-vertical-carousel-video]").forEach((video) => {
      if (video !== current) stopVideo(video)
    })
  }

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        key={`${videoSrc}-${attempt}`}
        title={title}
        aria-label={title}
        poster={poster || undefined}
        controls={isActive}
        muted={!isActive}
        playsInline
        preload="metadata"
        data-vertical-carousel-video
        data-active={isActive ? "true" : "false"}
        onPlay={handlePlay}
        onError={() => setFailed(true)}
        onLoadedData={() => setFailed(false)}
      >
        <source src={videoSrc} type="video/mp4" onError={() => { if (videoSrc === src) setFailed(true) }} />
        {videoSrc !== src ? <source src={src} type="video/mp4" onError={() => setFailed(true)} /> : null}
      </video>
      {failed && (
        <div className="video-error" role="status">
          <p>{copy.error}</p>
          <button type="button" onClick={() => { setFailed(false); setAttempt((value) => value + 1) }}>{copy.retry}</button>
          <a href={src} target="_blank" rel="noreferrer">{copy.original}</a>
        </div>
      )}
    </div>
  )
}
