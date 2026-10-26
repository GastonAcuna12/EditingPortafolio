import { useEffect, useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { ProjectPoster } from "./ProjectPoster"
import { getCloudinaryVideoPoster } from "../lib/cloudinary"
import { play } from "../lib/sound"

// Frames spread across each cut, like thumbnails on an editing track.
const STRIP = ["12p", "32p", "52p", "72p", "90p"]

function Filmstrip({ project, active, videoMode, label }) {
  return <span className="credit-strip" aria-hidden="true">
    <span className="credit-frame credit-frame--lead"><ProjectPoster project={project} videoMode={videoMode} previewing={active} label={label} sizes="(max-width: 760px) 20vw, 140px" /></span>
    {STRIP.slice(1).map((offset) => <span className="credit-frame" key={offset}><img src={getCloudinaryVideoPoster(project.videoSrc, videoMode, offset, 220)} alt="" loading="lazy" decoding="async" width="220" height="391" /></span>)}
    <span className="credit-playhead" />
  </span>
}

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
    <div className="credits-list" data-hovered={Boolean(hovered)} onPointerLeave={stop}>
      {projects.map((project, index) => <article className="credit" key={project.id} data-active={hovered === project.id || (pinned === project.id && selectedId === project.id)}>
        <button type="button" className="credit-open project-open" data-cursor="project" data-project-id={project.id} aria-label={`${copy.open} ${project.title}`} aria-haspopup="dialog" onClick={(event) => { setPinned(canHover && hovered === project.id ? project.id : null); stop(); onOpen(project.id, event.currentTarget) }} onPointerEnter={() => { if (canHover) { start(project.id); play("tick") } }} onPointerLeave={stop} onFocus={onPreload} onBlur={stop}>
          <span className="credit-index">{String(index + 1).padStart(2, "0")}</span>
          <span className="credit-head"><span className="credit-title">{project.title}</span><span className="credit-slate">{project.format} · {project.role}</span></span>
          <span className="credit-arrow"><ArrowUpRight size={23} aria-hidden="true" /></span>
          <Filmstrip project={project} videoMode={videoMode} active={hovered === project.id && canHover} label={copy.open} />
        </button>
      </article>)}
    </div>
  </section>
}
