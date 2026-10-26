import { useEffect, useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { ProjectPoster } from "./ProjectPoster"
import { play } from "../lib/sound"

export function FeaturedWork({ projects, onOpen, onPreload, videoMode, copy, selectedId }) {
  const [hovered, setHovered] = useState(null)
  const [pinned, setPinned] = useState(null)
  const [canHover, setCanHover] = useState(false)
  const timer = useRef(null)
  const follower = useRef(null)
  const pointer = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const query = matchMedia("(hover: hover) and (pointer: fine)")
    const update = () => setCanHover(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])
  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    if (!canHover) return
    let frame = 0
    const move = () => {
      current.current.x += (pointer.current.x - current.current.x) * .18
      current.current.y += (pointer.current.y - current.current.y) * .18
      if (follower.current) follower.current.style.transform = `translate3d(${current.current.x}px,${current.current.y}px,0)`
      frame = requestAnimationFrame(move)
    }
    frame = requestAnimationFrame(move)
    return () => cancelAnimationFrame(frame)
  }, [canHover])

  const start = (id) => {
    clearTimeout(timer.current)
    onPreload?.()
    timer.current = setTimeout(() => setHovered(id), 150)
  }
  const stop = () => { clearTimeout(timer.current); setHovered(null) }
  const track = (event) => {
    pointer.current = { x: event.clientX + 28, y: Math.min(event.clientY - 120, innerHeight - 260) }
    if (!hovered) current.current = { ...pointer.current }
  }
  return <section id="work" className="work-section shell" aria-labelledby="work-title">
    <div className="work-heading"><p className="eyebrow"><span className="section-index" aria-hidden="true">SEC 02</span>{copy.label}</p><h2 id="work-title">{copy.title}</h2><p>{copy.description}</p></div>
    <div className="credits-list" data-hovered={Boolean(hovered)} onPointerLeave={stop}>
      {projects.map((project, index) => <article className="credit" key={project.id} data-active={hovered === project.id || (pinned === project.id && selectedId === project.id)}>
        <button type="button" className="credit-open project-open" data-cursor="project" data-project-id={project.id} aria-label={`${copy.open} ${project.title}`} aria-haspopup="dialog" onClick={(event) => { setPinned(canHover && hovered === project.id ? project.id : null); stop(); onOpen(project.id, event.currentTarget) }} onPointerMove={canHover ? track : undefined} onPointerEnter={() => { if (canHover) { start(project.id); play("tick") } }} onPointerLeave={stop} onFocus={onPreload} onBlur={stop}>
          <span className="credit-index">{String(index + 1).padStart(2, "0")}</span>
          <span className="credit-title">{project.title}</span>
          <span className="credit-slate">{project.format} · {project.role}</span>
          <span className="credit-arrow"><ArrowUpRight size={23} aria-hidden="true" /></span>
          <span className="credit-preview" ref={hovered === project.id ? follower : null}><ProjectPoster project={project} videoMode={videoMode} previewing={hovered === project.id && canHover} eager={index === 0} label={copy.open} sizes="(max-width: 760px) 80px, 240px" /></span>
        </button>
      </article>)}
    </div>
  </section>
}
