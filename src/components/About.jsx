import { ArrowUpRight } from "lucide-react"
import { Reveal } from "./Reveal"

export function About({ copy }) {
  return (
    <section id="about" className="about-section shell" aria-labelledby="about-title">
      <Reveal className="about-heading"><p className="eyebrow">{copy.label}</p><h2 id="about-title">{copy.lines[0]}<em>{copy.lines[1]}</em></h2></Reveal>
      <div className="about-story">
        <Reveal><p className="about-intro">{copy.intro}</p></Reveal>
        {copy.paragraphs.map((paragraph, index) => <Reveal key={index} delay={0.06 * index}><p>{paragraph}</p></Reveal>)}
        <Reveal><p className="about-signoff">{copy.signoff}</p><a href="#contact" className="text-link">{copy.link}<ArrowUpRight size={19} aria-hidden="true" /></a></Reveal>
      </div>
    </section>
  )
}
