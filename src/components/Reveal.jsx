import { motion, useReducedMotion } from "motion/react"
import { timing, resolveEase } from "../lib/motion"

export function Reveal({ children, className = "", delay = 0 }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: timing.secondary / 1000, delay: reduced ? 0 : delay, ease: resolveEase }}
    >
      {children}
    </motion.div>
  )
}
