import { getCloudinarySharePoster } from "./cloudinary.js"

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character])

export function projectPageData(project) {
  return {
    title: `${project.copy.en.title} · Gastón Acuña`,
    description: project.copy.en.description,
    image: getCloudinarySharePoster(project.videoSrc, project.posterSecond ?? 1),
    url: `https://gaston.mov/work/${project.id}/`,
  }
}

export function renderProjectPage(indexHtml, project) {
  const data = projectPageData(project)
  const meta = [
    [/<title>[^<]*<\/title>/, `<title>${escapeHtml(data.title)}</title>`],
    [/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(data.description)}" />`],
    [/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeHtml(data.title)}" />`],
    [/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeHtml(data.description)}" />`],
    [/<meta property="og:image" content="[^"]*"\s*\/>/, `<meta property="og:image" content="${escapeHtml(data.image)}" />`],
    [/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${escapeHtml(data.url)}" />`],
    [/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${escapeHtml(data.url)}" />`],
  ]
  return meta.reduce((html, [pattern, replacement]) => {
    if (!pattern.test(html)) throw new Error(`Missing project page meta tag: ${pattern}`)
    return html.replace(pattern, replacement)
  }, indexHtml)
}
