import { useEffect, useState } from "react"
import { ArrowUpRight, Menu, X } from "lucide-react"

function Languages({ language, onChange, label }) {
  return (
    <div className="languages" role="group" aria-label={label}>
      {["en", "es"].map((locale) => (
        <button key={locale} type="button" lang={locale} aria-pressed={language === locale} onClick={() => onChange(locale)}>
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

export function SiteNav({ language, onLanguageChange, copy, hasLab }) {
  const [open, setOpen] = useState(false)
  const links = [{ href: "#work", label: copy.work }, { href: "#about", label: copy.about }]
  if (hasLab) links.push({ href: "#lab", label: copy.lab })

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 900px)")
    const closeOnDesktop = (event) => { if (event.matches) setOpen(false) }
    desktop.addEventListener("change", closeOnDesktop)
    return () => desktop.removeEventListener("change", closeOnDesktop)
  }, [])

  function navigate(event, href) {
    const target = document.querySelector(href)
    if (!target) return
    event.preventDefault()
    setOpen(false)
    requestAnimationFrame(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      target.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" })
      window.history.pushState(null, "", href)
    })
  }

  return (
    <header className="site-header">
      <nav className="shell nav-inner" aria-label={copy.label}>
        <a className="wordmark" href="#top" onClick={(event) => navigate(event, "#top")}>Gastón Acuña<span aria-hidden="true">.</span></a>
        <div className="desktop-nav">
          {links.map((link) => <a key={link.href} href={link.href} onClick={(event) => navigate(event, link.href)}>{link.label}</a>)}
          <a className="nav-contact" href="#contact" onClick={(event) => navigate(event, "#contact")}>{copy.contact}<ArrowUpRight size={17} aria-hidden="true" /></a>
          <Languages language={language} onChange={onLanguageChange} label={copy.language} />
        </div>
        <button className="menu-toggle icon-button" type="button" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? copy.close : copy.menu} onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
      {open && (
        <div id="mobile-nav" className="mobile-nav shell" onKeyDown={(event) => { if (event.key === "Escape") { setOpen(false); document.querySelector(".menu-toggle")?.focus() } }}>
          {[...links, { href: "#contact", label: copy.contact }].map((link) => <a key={link.href} href={link.href} onClick={(event) => navigate(event, link.href)}>{link.label}<ArrowUpRight size={18} aria-hidden="true" /></a>)}
          <Languages language={language} onChange={onLanguageChange} label={copy.language} />
        </div>
      )}
    </header>
  )
}
