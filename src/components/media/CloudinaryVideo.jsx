import { useEffect, useRef, useState } from "react"
import { Maximize, Pause, Play, Volume2, VolumeX } from "lucide-react"
import { getCloudinaryVideoPoster, getOptimizedCloudinaryVideo } from "../../lib/cloudinary"
import { FPS, formatTimecode, frameNumber } from "../../lib/timecode"

function stopVideo(video, reset = true) {
  video.pause()
  video.muted = true
  if (reset) {
    try { video.currentTime = 0 } catch { /* Metadata may not be available yet. */ }
  }
}

// An editor's viewer: SMPTE timecode, frame counter, scrub and J/K/L transport.
export function CloudinaryVideo({ src, posterSrc, title, videoMode = "desktop", isActive = true, copy }) {
  const videoRef = useRef(null)
  const playerRef = useRef(null)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [muted, setMuted] = useState(false)
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

  // Frame-accurate readout while playing; timeupdate alone only fires a few times a second.
  useEffect(() => {
    if (!playing) return
    let frame = 0
    const tick = () => { if (videoRef.current) setTime(videoRef.current.currentTime); frame = requestAnimationFrame(tick) }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [playing])

  function handlePlay(event) {
    const current = event.currentTarget
    if (!isActive || document.hidden) return stopVideo(current)
    current.muted = false
    setMuted(false)
    setStarted(true)
    setPlaying(true)
    document.querySelectorAll("video[data-vertical-carousel-video]").forEach((video) => {
      if (video !== current) stopVideo(video)
    })
  }

  function toggle() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) video.play().catch(() => {})
    else video.pause()
  }

  function seek(seconds) {
    const video = videoRef.current
    if (!video || !Number.isFinite(video.duration)) return
    video.currentTime = Math.min(Math.max(seconds, 0), video.duration)
    setTime(video.currentTime)
  }

  function step(frames) {
    const video = videoRef.current
    if (!video) return
    video.pause()
    seek(video.currentTime + frames / FPS)
  }

  function toggleMute() {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }

  function fullscreen() {
    const video = videoRef.current
    if (document.fullscreenElement) return document.exitFullscreen()
    if (playerRef.current?.requestFullscreen) return playerRef.current.requestFullscreen().catch(() => {})
    video?.webkitEnterFullscreen?.()
  }

  function onKeyDown(event) {
    if (event.target.closest("input") && ["ArrowLeft", "ArrowRight"].includes(event.key)) return
    if (event.target.closest("button") && (event.key === " " || event.key === "Enter")) return
    const actions = {
      " ": toggle, k: toggle, K: toggle,
      j: () => seek(time - 1), J: () => seek(time - 1),
      l: () => seek(time + 1), L: () => seek(time + 1),
      ArrowLeft: () => step(-1), ArrowRight: () => step(1), ",": () => step(-1), ".": () => step(1),
      m: toggleMute, M: toggleMute, f: fullscreen, F: fullscreen,
    }
    const action = actions[event.key]
    if (!action || event.metaKey || event.ctrlKey || event.altKey) return
    event.preventDefault()
    action()
  }

  const progress = duration ? time / duration : 0

  return (
    <div ref={playerRef} className="video-player" data-playing={playing} data-started={started} onKeyDown={onKeyDown}>
      <video
        ref={videoRef}
        key={`${videoSrc}-${attempt}`}
        title={title}
        aria-label={title}
        poster={poster || undefined}
        muted={!isActive}
        playsInline
        preload="metadata"
        data-vertical-carousel-video
        data-active={isActive ? "true" : "false"}
        onClick={toggle}
        onPlay={handlePlay}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onProgress={(event) => {
          const video = event.currentTarget
          if (video.buffered.length && video.duration) setBuffered(video.buffered.end(video.buffered.length - 1) / video.duration)
        }}
        onError={() => setFailed(true)}
        onLoadedData={() => setFailed(false)}
      >
        <source src={videoSrc} type="video/mp4" onError={() => { if (videoSrc === src) setFailed(true) }} />
        {videoSrc !== src ? <source src={src} type="video/mp4" onError={() => setFailed(true)} /> : null}
      </video>
      {isActive && !failed && (
        <>
          <button type="button" className="player-big-play" data-cursor="cta" onClick={toggle} aria-label={copy.play} tabIndex={started ? -1 : 0}>
            <Play size={30} fill="currentColor" aria-hidden="true" />
          </button>
          <div className="player-chrome">
            <div className="player-scrub" style={{ "--progress": progress, "--buffered": buffered }}>
              <input type="range" min="0" max={duration || 0} step={1 / FPS} value={Math.min(time, duration || 0)} onChange={(event) => seek(Number(event.target.value))} aria-label={copy.scrub} aria-valuetext={formatTimecode(time)} />
            </div>
            <div className="player-row">
              <button type="button" className="player-button" onClick={toggle} aria-label={playing ? copy.pause : copy.play} title={`${playing ? copy.pause : copy.play} (K)`}>
                {playing ? <Pause size={17} fill="currentColor" aria-hidden="true" /> : <Play size={17} fill="currentColor" aria-hidden="true" />}
              </button>
              <span className="player-tc" aria-hidden="true"><span>{formatTimecode(time)}</span><span className="player-tc-total"> / {formatTimecode(duration)}</span></span>
              <span className="player-frame" aria-hidden="true">FR {frameNumber(time)}</span>
              <span className="player-spacer" />
              <span className="player-keys" aria-hidden="true">J K L</span>
              <button type="button" className="player-button" onClick={toggleMute} aria-label={muted ? copy.unmute : copy.mute} title={`${muted ? copy.unmute : copy.mute} (M)`}>
                {muted ? <VolumeX size={17} aria-hidden="true" /> : <Volume2 size={17} aria-hidden="true" />}
              </button>
              <button type="button" className="player-button" onClick={fullscreen} aria-label={copy.fullscreen} title={`${copy.fullscreen} (F)`}>
                <Maximize size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </>
      )}
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
