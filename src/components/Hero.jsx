import { useCallback, useRef } from "react"
import { motion, useReducedMotion } from "motion/react"
import { ArrowDown } from "lucide-react"
import { RasterReveal } from "./RasterReveal"
import { HeroReel } from "./HeroReel"
import { resolveEase, timing } from "../lib/motion"

export function Hero({ copy, projects, videoMode, onOpen }) {
  const reduced = useReducedMotion()
  const titleRef = useRef(null)
  // Each cut on the monitor lands as a beat on one word: "clicks".
  const onCut = useCallback(() => {
    const title = titleRef.current
    if (title) title.dataset.beat = title.dataset.beat === "a" ? "b" : "a"
  }, [])
  return (
    <section id="top" className="hero shell" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="hero-role">{copy.role}</p>
        <h1 id="hero-title" ref={titleRef}>
          {copy.lines.map((line, index) => (
            <span className="line-mask" key={index}>
              {index === 1 ? <RasterReveal className="hero-italic" duration={timing.heroRaster} beatWord={copy.beatWord}>{line}</RasterReveal> : <motion.span initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .3 }}>{line}</motion.span>}
            </span>
          ))}
        </h1>
        <motion.div className="hero-bottom" initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: timing.secondary / 1000, delay: reduced ? 0 : 0.32, ease: resolveEase }}>
          <p>{copy.intro}</p>
          <a className="text-link" data-cursor="cta" href="#work">{copy.cta}<ArrowDown size={20} aria-hidden="true" /></a>
        </motion.div>
      </div>
      <motion.div className="hero-monitor" initial={reduced ? false : { opacity: 0, clipPath: "inset(0 0 100% 0)" }} animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }} transition={{ duration: .62, delay: reduced ? 0 : .18, ease: resolveEase }}>
        <HeroReel projects={projects} videoMode={videoMode} copy={copy} onOpen={onOpen} onCut={reduced ? undefined : onCut} />
      </motion.div>
    </section>
  )
}
