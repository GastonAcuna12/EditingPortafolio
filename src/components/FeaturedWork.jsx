import { motion, useReducedMotion } from "motion/react"
import { ArrowUpRight, Play } from "lucide-react"
import { Reveal } from "./Reveal"
import { ProjectPoster } from "./ProjectPoster"

export function FeaturedWork({ projects, onOpen, videoMode, copy }) {
  const reduced = useReducedMotion()
  const slots = ["lead", "pair", "pair", "interlude", "closing", "closing", "closing"]
  const imageSizes = {
    lead: "(max-width: 639px) calc(100vw - 40px), (max-width: 1199px) 46vw, 540px",
    pair: "(max-width: 639px) calc(100vw - 64px), (max-width: 1199px) 37vw, 410px",
    interlude: "(max-width: 639px) calc(100vw - 40px), (max-width: 1199px) 43vw, 450px",
    closing: "(max-width: 639px) 112px, (max-width: 1199px) 27vw, 390px",
  }
  return (
    <section id="work" className="work-section shell" aria-labelledby="work-title">
      <Reveal className="work-heading">
        <div><p className="eyebrow">{copy.label}</p><h2 id="work-title">{copy.title}</h2></div>
        <p>{copy.description}</p>
      </Reveal>
      <div className="work-gallery">
        {projects.map((project, index) => {
          const slot = slots[index] || "closing"
          return (
            <motion.article className={`project project--${slot}`} key={project.id} initial={reduced ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.06 }} transition={{ duration: 0.48, delay: slot === "pair" ? (index - 1) * 0.07 : 0, ease: [0.22, 1, 0.36, 1] }}>
              <button type="button" className="project-open" data-project-id={project.id} onClick={(event) => onOpen(project.id, event.currentTarget)} aria-label={`${copy.open} ${project.title}`} aria-haspopup="dialog">
                <ProjectPoster project={project} videoMode={videoMode} eager={index === 0} label={copy.open} sizes={imageSizes[slot]} />
                <span className="project-caption"><span>
                  {slot === "lead" && <span className="project-featured">{copy.featured}</span>}
                  <span className="project-title">{project.title}</span>
                  <span className="project-category">{project.category}</span>
                  {(slot === "lead" || slot === "interlude") && <span className="project-summary">{project.intro}</span>}
                  <span className="project-action"><Play size={14} aria-hidden="true" /><span>{copy.open}</span></span>
                </span><ArrowUpRight className="project-arrow" size={22} aria-hidden="true" /></span>
              </button>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
