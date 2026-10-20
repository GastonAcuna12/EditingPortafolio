export const FPS = 30

const pad = (value) => String(value).padStart(2, "0")

// SMPTE-style HH:MM:SS:FF, the way an editor reads time.
export function formatTimecode(seconds, fps = FPS) {
  const totalFrames = Math.max(0, Math.floor((Number.isFinite(seconds) ? seconds : 0) * fps + 1e-6))
  const frames = totalFrames % fps
  const totalSeconds = Math.floor(totalFrames / fps)
  return `${pad(Math.floor(totalSeconds / 3600))}:${pad(Math.floor(totalSeconds / 60) % 60)}:${pad(totalSeconds % 60)}:${pad(frames)}`
}

export function frameNumber(seconds, fps = FPS) {
  return String(Math.max(0, Math.floor((Number.isFinite(seconds) ? seconds : 0) * fps + 1e-6))).padStart(4, "0")
}
