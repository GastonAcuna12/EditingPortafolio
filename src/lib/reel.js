// The Hero reel is one MP4 that Cloudinary splices from short cuts of the real projects.
// It keeps each cut's own audio; the monitor plays muted until the visitor turns sound on.
// Each cut: project id, in-point and length in seconds. Varied lengths keep the rhythm alive.
export const reelCuts = [
  { id: "julian-motion-performance", in: 1, length: 1.2 },
  { id: "gorilon-event", in: 8, length: 0.9 },
  { id: "top-iphone", in: 5, length: 1 },
  { id: "which-is-stronger-motion-ad", in: 2.6, length: 1.1 },
  { id: "the-guest-rush-3d-ad", in: 3, length: 1.3 },
  { id: "authoritative-motion-ad", in: 8, length: 0.9 },
  { id: "semana-santa-motion-ad", in: 3, length: 1.2 },
]

const round = (value) => Math.round(value * 100) / 100

function publicId(src) {
  const match = src.match(/\/video\/upload\/(?:.*?\/)?(?:v\d+\/)?([^/]+)\.mp4$/)
  return match ? match[1] : null
}

function versionedPath(src) {
  const [, rest] = src.split("/video/upload/")
  const match = rest.match(/(v\d+\/.*)$/)
  return match ? match[1] : rest.split("/").at(-1)
}

export function buildReelUrl(projects, mode = "desktop", cuts = reelCuts) {
  const byId = new Map(projects.map((project) => [project.id, project]))
  const usable = cuts.filter((cut) => byId.get(cut.id)?.videoSrc?.includes("res.cloudinary.com"))
  if (!usable.length) return null
  const size = mode === "mobile" ? "w_360,h_640" : "w_540,h_960"
  const look = `${size},c_fill,q_auto:eco`
  const [first, ...rest] = usable
  const firstSrc = byId.get(first.id).videoSrc
  const [prefix] = firstSrc.split("/video/upload/")
  const layers = rest.map((cut) => {
    const id = publicId(byId.get(cut.id).videoSrc)
    return `l_video:${id},so_${cut.in},eo_${round(cut.in + cut.length)},${look},fl_splice/fl_layer_apply`
  })
  return [`${prefix}/video/upload/so_${first.in},eo_${round(first.in + first.length)},${look}`, ...layers, `f_mp4,vc_h264:baseline:3.1/${versionedPath(firstSrc)}`].join("/")
}

export function reelDuration(cuts = reelCuts) {
  return round(cuts.reduce((total, cut) => total + cut.length, 0))
}

// Which cut is on screen at a given time of the reel.
export function cutAt(time, cuts = reelCuts) {
  let start = 0
  for (let index = 0; index < cuts.length; index += 1) {
    const end = start + cuts[index].length
    if (time < end) return { ...cuts[index], index, start }
    start = end
  }
  return { ...cuts.at(-1), index: cuts.length - 1, start: start - cuts.at(-1).length }
}
