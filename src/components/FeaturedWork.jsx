import { useState } from "react"
import { ArrowDown, ArrowUp, ArrowUpRight } from "lucide-react"
import { Reveal } from "./Reveal"
import { ProjectPoster } from "./ProjectPoster"

export function FeaturedWork({ projects, onOpen, videoMode, copy }) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? projects : projects.slice(0, 6)
  return (
    <section id="work" className="work-section shell" aria-labelledby="work-title">
      <Reveal className="work-heading">
        <div><p className="eyebrow">{copy.label}</p><h2 id="work-title">{copy.title}</h2></div>
        <p>{copy.description}</p>
      </Reveal>
      <div className="work-gallery">
        {visible.map((project, index) => (
          <Reveal className="project" key={project.id}>
            <button type="button" className="project-open" onClick={(event) => onOpen(project.id, event.currentTarget)} aria-label={`${copy.open} ${project.title}`} aria-haspopup="dialog">
              <ProjectPoster project={project} videoMode={videoMode} eager={index < 2} label={copy.open} />
              <span className="project-caption"><span><span className="project-title">{project.title}</span><span className="project-category">{project.category}</span></span><ArrowUpRight size={22} aria-hidden="true" /></span>
            </button>
          </Reveal>
        ))}
      </div>
      {projects.length > 6 && <div className="work-more"><button className="text-link" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? copy.less : copy.more}{expanded ? <ArrowUp size={19} aria-hidden="true" /> : <ArrowDown size={19} aria-hidden="true" />}</button></div>}
    </section>
  )
}
