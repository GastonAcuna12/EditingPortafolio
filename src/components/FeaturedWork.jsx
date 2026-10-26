import { useEffect, useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { ProjectPoster } from "./ProjectPoster"
import { play } from "../lib/sound"

export function FeaturedWork({ projects, onOpen, onPreload, videoMode, copy, selectedId }) {
  const [hovered, setHovered] = useState(null)
  const [pinned, setPinned] = useState(null)
  const [canHover, setCanHover] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    const query = matchMedia("(hover: hover) and (pointer: fine)")
    const update = () => setCanHover(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])
  useEffect(() => () => clearTimeout(timer.current), [])
  const start = (id) => {
    clearTimeout(timer.current)
    onPreload?.()
    timer.current = setTimeout(() => setHovered(id), 150)
  }
  const stop = () => { clearTimeout(timer.current); setHovered(null) }
  return <section id="work" className="work-section shell" aria-labelledby="work-title">
    <div className="work-heading"><p className="eyebrow"><span className="section-index" aria-hidden="true">SEC 02</span>{copy.label}</p><h2 id="work-title">{copy.title}</h2><p>{copy.description}</p></div>
    <div className="sheet" data-hovered={Boolean(hovered)} onPointerLeave={stop}>
      {projects.map((project, index) => <article className="sheet-card" key={project.id} data-active={hovered === project.id || (pinned === project.id && selectedId === project.id)}>
        <button type="button" className="sheet-open project-open" data-cursor="project" data-project-id={project.id} aria-label={`${copy.open} ${project.title}`} aria-haspopup="dialog" onClick={(event) => { setPinned(canHover && hovered === project.id ? project.id : null); stop(); onOpen(project.id, event.currentTarget) }} onPointerEnter={() => { if (canHover) { start(project.id); play("tick") } }} onPointerLeave={stop} onFocus={onPreload} onBlur={stop}>
          <span className="sheet-media">
            <ProjectPoster project={project} videoMode={videoMode} previewing={hovered === project.id && canHover} eager={index === 0} label={copy.open} sizes={index === 0 ? "(max-width: 760px) 100vw, 50vw" : "(max-width: 760px) 50vw, 25vw"} />
            <span className="sheet-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          </span>
          <span className="sheet-meta"><span className="sheet-title">{project.title}</span><span className="sheet-slate">{project.format} · {project.category}</span><ArrowUpRight className="sheet-arrow" size={18} aria-hidden="true" /></span>
        </button>
      </article>)}
      <a className="sheet-more" href="#contact"><span>{copy.moreTitle}</span><span className="sheet-more-cta">{copy.moreCta}<ArrowUpRight size={22} aria-hidden="true" /></span></a>
    </div>
  </section>
}
