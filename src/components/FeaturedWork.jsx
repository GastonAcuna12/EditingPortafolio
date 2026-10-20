import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { ArrowUpRight, Play } from "lucide-react"
import { Reveal } from "./Reveal"
import { ProjectPoster } from "./ProjectPoster"
import { resolveEase, timing } from "../lib/motion"
import { play } from "../lib/sound"

export function FeaturedWork({ projects, onOpen, videoMode, copy }) {
  const reduced = useReducedMotion()
  const [hovered, setHovered] = useState(null)
  const [canHover, setCanHover] = useState(false)
  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)")
    const update = () => setCanHover(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])
  const slots = ["lead", "pair", "pair", "interlude", "closing", "closing", "closing"]
  const imageSizes = {
    lead: "(max-width: 639px) calc(100vw - 40px), (max-width: 1199px) 46vw, 540px",
    pair: "(max-width: 639px) calc(100vw - 64px), (max-width: 1199px) 37vw, 410px",
    interlude: "(max-width: 639px) calc(100vw - 40px), (max-width: 1199px) 43vw, 450px",
    closing: "(max-width: 639px) 112px, (max-width: 1199px) 27vw, 390px",
  }
  return (
    <motion.section id="work" className="work-section shell" aria-labelledby="work-title" viewport={{ once: true, amount: 0 }} onViewportEnter={(entry) => { if (entry) entry.target.dataset.entered = "true" }}>
      <Reveal className="work-heading">
        <div><p className="eyebrow">{copy.label}</p><h2 id="work-title">{copy.title}</h2></div>
        <p>{copy.description}</p>
      </Reveal>
      <div className="work-gallery">
        {projects.map((project, index) => {
          const slot = slots[index] || "closing"
          return (
            <article className={`project project--${slot}`} key={project.id}>
              <button type="button" className="project-open" data-cursor="project" data-project-id={project.id} onClick={(event) => { setHovered(null); onOpen(project.id, event.currentTarget) }} onPointerEnter={() => { if (canHover) { setHovered(project.id); play("tick") } }} onPointerLeave={() => setHovered((current) => current === project.id ? null : current)} aria-label={`${copy.open} ${project.title}`} aria-haspopup="dialog">
                <ProjectPoster project={project} videoMode={videoMode} previewing={hovered === project.id} eager={index === 0} label={copy.open} sizes={imageSizes[slot]} />
                <motion.span className="project-caption" initial={reduced ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: .06 }} transition={{ duration: timing.ui / 1000, delay: reduced ? 0 : slot === "lead" || slot === "interlude" ? .12 : slot === "pair" ? (index - 1) * .07 : .04, ease: resolveEase }}><span>
                  {slot === "lead" && <span className="project-featured">{copy.featured}</span>}
                  <span className="project-title">{project.title}</span>
                  <span className="project-category">{project.category}</span>
                  {(slot === "lead" || slot === "interlude") && <span className="project-summary">{project.intro}</span>}
                  {(slot === "lead" || slot === "interlude") && <span className="project-meta"><span><span className="project-meta-label">{copy.role}</span>{project.role}</span><span><span className="project-meta-label">{copy.format}</span>{project.format}</span></span>}
                  <span className="project-action"><Play size={14} aria-hidden="true" /><span>{copy.open}</span></span>
                </span><ArrowUpRight className="project-arrow" size={22} aria-hidden="true" /></motion.span>
              </button>
            </article>
          )
        })}
      </div>
    </motion.section>
  )
}
