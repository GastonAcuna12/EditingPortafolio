import { motion, useReducedMotion } from "motion/react"
import { ArrowDown } from "lucide-react"

export function Hero({ copy }) {
  const reduced = useReducedMotion()
  return (
    <section id="top" className="hero shell" aria-labelledby="hero-title">
      <p className="hero-role">{copy.role}</p>
      <h1 id="hero-title">
        {copy.lines.map((line, index) => (
          <span className="line-mask" key={index}>
            <motion.span className={index === 1 ? "hero-italic" : ""} initial={reduced ? false : { y: 48, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.85, delay: 0.12 + index * 0.14, ease: [0.22, 1, 0.36, 1] }}>{line}</motion.span>
          </span>
        ))}
      </h1>
      <motion.div className="hero-bottom" initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
        <p>{copy.intro}</p>
        <a className="text-link" href="#work">{copy.cta}<ArrowDown size={20} aria-hidden="true" /></a>
      </motion.div>
    </section>
  )
}
