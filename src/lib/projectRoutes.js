export function getProjectIdFromUrl(href, ids) {
  const url = new URL(href)
  const queried = url.searchParams.get("project")
  if (queried) return ids.includes(queried) ? queried : null
  const pathId = url.pathname.match(/^\/work\/([^/]+)\/?$/)?.[1]
  return pathId && ids.includes(pathId) ? pathId : null
}

export function projectUrl(href, id) {
  const url = new URL(href)
  if (/^\/work\/[^/]+\/?$/.test(url.pathname)) url.pathname = "/"
  if (id) url.searchParams.set("project", id)
  else url.searchParams.delete("project")
  return url
}
