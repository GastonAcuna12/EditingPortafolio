import { useEffect, useRef, useState } from "react"
import { ProjectPoster } from "./ProjectPoster"

// More work: a compact grid under the gallery. Same posters and detail as the featured pieces,
// smaller, with the client under each title. Previews play on hover where hover exists.
export function MoreWork({ projects, onOpen, onPreload, videoMode, copy }) {
  const [hovered, setHovered] = useState(null)
  const [canHover, setCanHover] = useState(false)
  const timer = useRef(null)
  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)")
    const update = () => setCanHover(query.matches)
    update()
    query.addEventListener("change", update)
    return () => { query.removeEventListener("change", update); clearTimeout(timer.current) }
  }, [])
  if (!projects.length) return null
  const start = (id) => { clearTimeout(timer.current); onPreload?.(); if (canHover) timer.current = setTimeout(() => setHovered(id), 150) }
  const stop = (id) => { clearTimeout(timer.current); setHovered((current) => current === id ? null : current) }
  return (
    <section id="more-work" className="more-work shell" aria-labelledby="more-work-title">
      <h2 id="more-work-title" className="eyebrow">{copy.label}</h2>
      <ul className="more-grid">
        {projects.map((project) => (
          <li key={project.id}>
            <button type="button" className="project-open more-item" data-project-id={project.id} onClick={(event) => { stop(project.id); onOpen(project.id, event.currentTarget) }} onPointerEnter={() => start(project.id)} onPointerLeave={() => stop(project.id)} onFocus={() => onPreload?.()} aria-label={`${copy.open} ${project.title}${project.client ? `, ${project.client}` : ""}`} aria-haspopup="dialog">
              <ProjectPoster project={project} videoMode={videoMode} previewing={hovered === project.id} label={copy.open} sizes="(max-width: 639px) calc(50vw - 27px), (max-width: 1199px) 30vw, 200px" />
              <span className="more-caption"><span className="more-title">{project.title}</span>{project.client && <span className="more-client">{project.client}</span>}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
