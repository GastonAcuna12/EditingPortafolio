import { useCallback, useEffect, useRef, useState } from "react"

export function useProjectNavigation(projects) {
  const ids = projects.map((project) => project.id).join("|")
  const readProject = useCallback(() => {
    const id = new URL(window.location.href).searchParams.get("project")
    return ids.split("|").includes(id) ? id : null
  }, [ids])
  const [selection, setSelection] = useState(() => {
    const id = readProject()
    return id ? { id, origin: null, closing: false } : null
  })
  const returnFocus = useRef(null)

  useEffect(() => {
    const onPopState = () => {
      const id = readProject()
      setSelection((current) => id
        ? { id, origin: null, closing: false }
        : current ? { ...current, closing: true } : null)
    }
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [readProject])

  function projectUrl(id) {
    const url = new URL(window.location.href)
    if (id) url.searchParams.set("project", id)
    else url.searchParams.delete("project")
    return url
  }

  function openProject(id, trigger) {
    const cover = trigger?.querySelector(".project-cover")
    const image = cover?.querySelector("img")
    const rect = cover?.getBoundingClientRect()
    const origin = image?.complete && image.naturalWidth && rect
      ? { rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height }, src: image.currentSrc }
      : null
    returnFocus.current = trigger
    window.history.pushState({ ...window.history.state, portfolioProject: true }, "", projectUrl(id))
    setSelection({ id, origin, closing: false })
  }

  function closeProject() {
    if (!selection || selection.closing) return
    setSelection((current) => ({ ...current, closing: true }))
    // A gallery visit is one history entry, even after previous/next navigation.
    if (window.history.state?.portfolioProject) window.history.back()
    else window.history.replaceState(window.history.state, "", projectUrl(null))
  }

  function stepProject(direction) {
    if (!selection || selection.closing) return
    const index = projects.findIndex((project) => project.id === selection.id)
    const id = projects[(index + direction + projects.length) % projects.length].id
    window.history.replaceState(window.history.state, "", projectUrl(id))
    setSelection({ id, origin: null, closing: false })
  }

  const finishClose = useCallback(() => {
    setSelection(null)
    requestAnimationFrame(() => {
      if (returnFocus.current?.isConnected) returnFocus.current.focus({ preventScroll: true })
    })
  }, [])

  return { selection, openProject, closeProject, stepProject, finishClose }
}
