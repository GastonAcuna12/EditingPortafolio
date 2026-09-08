import { ArrowUpRight } from "lucide-react"
import { Reveal } from "./Reveal"
import { motion } from "motion/react"

export function About({ copy }) {
  return (
    <section id="about" className="about-section shell" aria-labelledby="about-title">
      <motion.div className="about-heading" viewport={{ once: true, amount: 0.2 }} onViewportEnter={(entry) => { if (entry) entry.target.dataset.revealed = "true" }}>
        <p className="eyebrow">{copy.label}</p>
        <h2 id="about-title"><span className="about-title-mask"><span>{copy.lines[0]}</span></span>{" "}<span className="about-title-mask"><span>{copy.lines[1]}</span></span><em>{copy.lines[2]}</em></h2>
      </motion.div>
      <Reveal className="about-story">
        <p className="about-intro">{copy.intro}</p>
        {copy.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        <div><p className="about-signoff">{copy.signoff}</p><a href="#contact" className="text-link">{copy.link}<ArrowUpRight size={19} aria-hidden="true" /></a></div>
      </Reveal>
    </section>
  )
}
