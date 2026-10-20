import { motion, useReducedMotion } from "motion/react"
import { ArrowDown } from "lucide-react"
import { RasterReveal } from "./RasterReveal"
import { resolveEase, timing } from "../lib/motion"

export function Hero({ copy }) {
  const reduced = useReducedMotion()
  return (
    <section id="top" className="hero shell" aria-labelledby="hero-title">
      <p className="hero-role">{copy.role}</p>
      <h1 id="hero-title">
        {copy.lines.map((line, index) => (
          <span className="line-mask" key={index}>
            {index === 1 ? <RasterReveal className="hero-italic" duration={timing.heroRaster}>{line}</RasterReveal> : <motion.span initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .3 }}>{line}</motion.span>}
          </span>
        ))}
      </h1>
      <motion.div className="hero-bottom" initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: timing.secondary / 1000, delay: reduced ? 0 : 0.32, ease: resolveEase }}>
        <p>{copy.intro}</p>
        <a className="text-link" data-cursor="cta" href="#work">{copy.cta}<ArrowDown size={20} aria-hidden="true" /></a>
      </motion.div>
    </section>
  )
}
