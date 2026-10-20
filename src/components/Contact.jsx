import { ArrowUp, ArrowUpRight, Check, Copy } from "lucide-react"
import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { contact } from "../data/portfolio"
import { useCopyEmail } from "../hooks/useCopyEmail"
import "./Contact.css"

export function Contact({ copy, role }) {
  const { copied, copyEmail } = useCopyEmail()
  const endRef = useRef(null)
  const reduced = useReducedMotion()
  // The last frame of the page: the name pulls into focus as you arrive, then the bottom dissolves to black.
  const { scrollYProgress } = useScroll({ target: endRef, offset: ["start end", "end end"] })
  const clamp = (value) => Math.min(1, Math.max(0, value))
  const opacity = useTransform(scrollYProgress, (value) => clamp(value / .85))
  const filter = useTransform(scrollYProgress, (value) => `blur(${(1 - clamp(value / .9)) * 14}px)`)
  const y = useTransform(scrollYProgress, (value) => (1 - clamp(value)) * 48)
  return (
    <motion.footer id="contact" className="contact-section" aria-labelledby="contact-title" viewport={{ once: true, amount: .2 }} onViewportEnter={entry => { if (entry) entry.target.dataset.entered = "true" }}>
      <div className="contact-content shell">
        <div className="contact-heading"><p className="eyebrow">{copy.label}</p>
        <h2 id="contact-title"><span>{copy.lines[0]}</span><span>{copy.lines[1]}</span></h2></div>
        <div className="contact-body"><p>{copy.description}</p><div className="contact-links">
          <div className="email-row"><a className="email-link" data-cursor="cta" href={`mailto:${contact.email}`}>{contact.email}<ArrowUpRight size={25} aria-hidden="true" /></a><button type="button" className="icon-button copy-email" data-cursor="copy" data-copied={copied} onClick={copyEmail} aria-label={copied ? copy.copied : copy.copy} title={copied ? copy.copied : copy.copy}>{copied ? <Check size={19} /> : <Copy size={19} />}</button></div>
          <div className="social-links"><a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp<ArrowUpRight size={17} aria-hidden="true" /></a><a href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn<ArrowUpRight size={17} aria-hidden="true" /></a></div>
        </div></div>
      </div>
      <div role="status" aria-live="polite" className={`copy-feedback ${copied ? "is-visible" : ""}`}>{copied ? copy.copied : ""}</div>
      <div className="footer-credits shell">
        <div className="footer-cut" aria-hidden="true" />
        <div className="footer-line">
          <div className="footer-author"><span>Gastón Acuña<span className="footer-stop" aria-hidden="true">.</span></span><span>{copy.location}</span></div>
          <div className="footer-role"><span>{role}</span><span>© {new Date().getFullYear()}</span></div>
          <a href="#top">{copy.back}<ArrowUp size={16} aria-hidden="true" /></a>
        </div>
      </div>
      <div ref={endRef} className="footer-end" aria-hidden="true">
        <motion.p style={reduced ? undefined : { opacity, filter, y }}>Gastón Acuña<span>.</span></motion.p>
      </div>
    </motion.footer>
  )
}
