function getCloudinaryPublicVideoPath(src) {
  if (!src || !src.includes("res.cloudinary.com") || !src.includes("/video/upload/")) {
    return null
  }

  const [, rest] = src.split("/video/upload/")
  const versionMatch = rest.match(/(v\d+\/.*)$/)

  return versionMatch ? versionMatch[1] : rest
}

export function getOptimizedCloudinaryVideo(src, mode = "desktop") {
  if (!src || !src.includes("res.cloudinary.com") || !src.includes("/video/upload/")) {
    return src
  }

  const [prefix] = src.split("/video/upload/")
  const publicPath = getCloudinaryPublicVideoPath(src)

  if (!publicPath) return src

  const transform =
    mode === "mobile"
      ? "f_mp4,q_auto:eco,w_540"
      : "f_mp4,q_auto,w_720"

  return `${prefix}/video/upload/${transform}/${publicPath}`
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

  return `${prefix}/video/upload/so_${second},f_jpg,q_auto:eco,${width}/${posterPath}`
}

export function getCloudinaryPosterSrcSet(src, second = 0) {
  if (!getCloudinaryVideoPoster(src)) return undefined
  return [360, 540, 720, 1080].map((width) => `${getCloudinaryVideoPoster(src, "desktop", second, width)} ${width}w`).join(", ")
}

// Short silent clip for hover previews: starts on the curated poster frame, so the still comes alive.
export function getCloudinaryPreview(src, second = 0, length = 6) {
  if (!src || !src.includes("res.cloudinary.com") || !src.includes("/video/upload/")) return null
  const [prefix] = src.split("/video/upload/")
  const publicPath = getCloudinaryPublicVideoPath(src)
  if (!publicPath) return null
  return `${prefix}/video/upload/so_${second},eo_${Math.round((second + length) * 100) / 100},f_mp4,q_auto:eco,w_540,ac_none/${publicPath}`
}
