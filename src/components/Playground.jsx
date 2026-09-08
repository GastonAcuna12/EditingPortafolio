import { Reveal } from "./Reveal"
import { ProjectPoster } from "./ProjectPoster"

export function Playground({ projects, onOpen, videoMode, copy, watchLabel }) {
  if (!projects.length) return null
  return (
    <section id="lab" className="lab-section shell" aria-labelledby="lab-title">
      <Reveal><p className="eyebrow">{copy.label}</p><h2 id="lab-title">{copy.title}</h2><p>{copy.description}</p></Reveal>
      <div className="lab-gallery">{projects.map((project) => <button className="project-open" key={project.id} type="button" onClick={(event) => onOpen(project.id, event.currentTarget)} aria-label={`${watchLabel} ${project.title}`}><ProjectPoster project={project} videoMode={videoMode} label={watchLabel} /><span className="project-caption"><span className="project-title">{project.title}</span></span></button>)}</div>
    </section>
  )
}
