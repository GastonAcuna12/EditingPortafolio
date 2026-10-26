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
  const [active, setActive] = useState(projects[0]?.id)
  const current = projects.find((project) => project.id === active) || projects[0]
  const point = (id) => {
    setActive(id)
    clearTimeout(timer.current)
    onPreload?.()
    timer.current = setTimeout(() => setHovered(id), 150)
  }
  const stop = () => { clearTimeout(timer.current); setHovered(null) }
  const open = (id, element) => { setPinned(id); stop(); onOpen(id, element) }
  // An editor's bay: a clean list of titles beside one big program monitor.
  return <section id="work" className="work-section shell" aria-labelledby="work-title">
    <div className="work-heading"><p className="eyebrow"><span className="section-index" aria-hidden="true">SEC 02</span>{copy.label}</p><h2 id="work-title">{copy.title}</h2><p>{copy.description}</p></div>
    <div className="bay">
      <ol className="bay-list" onPointerLeave={stop}>
        {projects.map((project, index) => <li key={project.id} className="bay-row" data-active={current?.id === project.id || (pinned === project.id && selectedId === project.id)}>
          <button type="button" className="bay-open project-open" data-cursor="project" data-project-id={project.id} aria-label={`${copy.open} ${project.title}`} aria-haspopup="dialog" onClick={(event) => open(project.id, event.currentTarget)} onPointerEnter={() => { if (canHover) { point(project.id); play("tick") } }} onFocus={() => point(project.id)} onBlur={stop}>
            <span className="bay-thumb"><ProjectPoster project={project} videoMode={videoMode} eager={index === 0} label={copy.open} sizes="96px" /></span>
            <span className="bay-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="bay-title">{project.title}</span>
            <span className="bay-cat">{project.category}</span>
            <ArrowUpRight className="bay-arrow" size={18} aria-hidden="true" />
          </button>
        </li>)}
      </ol>
      {current && <div className="bay-monitor" aria-hidden="true">
        <button type="button" className="bay-screen" tabIndex={-1} onClick={(event) => open(current.id, event.currentTarget)}>
          <ProjectPoster key={current.id} project={current} videoMode={videoMode} previewing={canHover && hovered === current.id} eager label={copy.open} sizes="(max-width: 1200px) 34vw, 420px" />
        </button>
        <div className="bay-caption"><span className="bay-slate">{current.format} · {current.role}</span><p>{current.intro}</p></div>
      </div>}
    </div>
  </section>
}
