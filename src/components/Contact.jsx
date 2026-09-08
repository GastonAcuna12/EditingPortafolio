import { ArrowUp, ArrowUpRight, Check, Copy } from "lucide-react"
import { contact } from "../data/portfolio"
import { useCopyEmail } from "../hooks/useCopyEmail"
import { Reveal } from "./Reveal"
import { AcunaResidue } from "./AcunaResidue"

export function Contact({ copy }) {
  const { copied, copyEmail } = useCopyEmail()
  return (
    <footer id="contact" className="contact-section" aria-labelledby="contact-title">
      <Reveal className="contact-content shell">
        <p className="eyebrow">{copy.label}</p>
        <h2 id="contact-title">{copy.lines[0]}<br /><em>{copy.lines[1]}</em></h2>
        <div className="contact-body"><p>{copy.description}</p><div className="contact-links">
          <div className="email-row"><a className="email-link" href={`mailto:${contact.email}`}>{contact.email}<ArrowUpRight size={25} aria-hidden="true" /></a><button type="button" className="icon-button copy-email" onClick={copyEmail} aria-label={copied ? copy.copied : copy.copy} title={copied ? copy.copied : copy.copy}>{copied ? <Check size={19} /> : <Copy size={19} />}</button></div>
          <div className="social-links"><a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp<ArrowUpRight size={17} aria-hidden="true" /></a><a href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn<ArrowUpRight size={17} aria-hidden="true" /></a></div>
        </div></div>
      </Reveal>
      <div className="contact-art"><AcunaResidue /></div>
      <div role="status" aria-live="polite" className={`copy-feedback ${copied ? "is-visible" : ""}`}>{copied ? copy.copied : ""}</div>
      <div className="footer-line shell"><span>© {new Date().getFullYear()} Gastón Acuña</span><span>{copy.location}</span><a href="#top">{copy.back}<ArrowUp size={16} aria-hidden="true" /></a></div>
    </footer>
  )
}
