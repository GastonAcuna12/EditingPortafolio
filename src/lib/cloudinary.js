function getCloudinaryPublicVideoPath(src) {
  if (!src || !src.includes("res.cloudinary.com") || !src.includes("/video/upload/")) {
    return null
  }

  const [, rest] = src.split("/video/upload/")
  const versionMatch = rest.match(/(v\d+\/.*)$/)

  return versionMatch ? versionMatch[1] : rest
}

// Horizontal (16:9) pieces fill the page width, so they ask Cloudinary for more pixels.
export const isWideProject = (project) => project?.format === "16:9"

export function getOptimizedCloudinaryVideo(src, mode = "desktop", wide = false) {
  if (!src || !src.includes("res.cloudinary.com") || !src.includes("/video/upload/")) {
    return src
  }

  const [prefix] = src.split("/video/upload/")
  const publicPath = getCloudinaryPublicVideoPath(src)

  if (!publicPath) return src

  const transform =
    mode === "mobile"
      ? `f_mp4,q_auto:eco,w_${wide ? 960 : 540}`
      : `f_mp4,q_auto,w_${wide ? 1600 : 720}`

  return `${prefix}/video/upload/${transform}/${publicPath}`
}

// Checked 2026-10-25: Cloudinary serves the VP9 variants, 24-52% lighter than the MP4 at the same width and quality.
export const ENABLE_VP9_SOURCE = true

export function getCloudinaryVp9Video(src, mode = "desktop", wide = false) {
  if (!getCloudinaryPublicVideoPath(src)) return null
  const [prefix] = src.split("/video/upload/")
  const publicPath = getCloudinaryPublicVideoPath(src).replace(/\.mp4(\?.*)?$/i, ".webm$1")
  const transform = mode === "mobile" ? `q_auto:eco,w_${wide ? 960 : 540}` : `q_auto,w_${wide ? 1600 : 720}`
  return `${prefix}/video/upload/f_webm,vc_vp9,${transform}/${publicPath}`
}

export function getCloudinaryVideoPoster(src, mode = "desktop", second = 0, requestedWidth) {
  if (!src || !src.includes("res.cloudinary.com") || !src.includes("/video/upload/")) {
    return null
  }

  const [prefix] = src.split("/video/upload/")
  const publicPath = getCloudinaryPublicVideoPath(src)
  if (!publicPath) return null

  const posterPath = publicPath.replace(/\.(mp4|mov|webm)(\?.*)?$/i, ".jpg$2")
  const width = `w_${requestedWidth || (mode === "mobile" ? 360 : 540)}`

  return `${prefix}/video/upload/so_${second},f_auto,q_auto:eco,${width}/${posterPath}`
}

export function getCloudinaryPosterSrcSet(src, second = 0, wide = false) {
  if (!getCloudinaryVideoPoster(src)) return undefined
  return (wide ? [640, 960, 1280, 1920] : [360, 540, 720, 1080]).map((width) => `${getCloudinaryVideoPoster(src, "desktop", second, width)} ${width}w`).join(", ")
}

export function getCloudinarySharePoster(src, second = 0) {
  const publicPath = getCloudinaryPublicVideoPath(src)
  if (!publicPath) return null
  const [prefix] = src.split("/video/upload/")
  return `${prefix}/video/upload/so_${second},c_pad,w_1200,h_630,b_black,f_jpg,q_auto/${publicPath.replace(/\.mp4(\?.*)?$/i, ".jpg$1")}`
}

// Short silent clip for hover previews: starts on the curated poster frame, so the still comes alive.
export function getCloudinaryPreview(src, second = 0, length = 6, width = 540) {
  if (!src || !src.includes("res.cloudinary.com") || !src.includes("/video/upload/")) return null
  const [prefix] = src.split("/video/upload/")
  const publicPath = getCloudinaryPublicVideoPath(src)
  if (!publicPath) return null
  return `${prefix}/video/upload/so_${second},eo_${Math.round((second + length) * 100) / 100},f_mp4,q_auto:eco,w_${width},ac_none/${publicPath}`
}
