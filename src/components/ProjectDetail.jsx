import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { ArrowLeft, ArrowRight, X } from "lucide-react"
import { CloudinaryVideo } from "./media/CloudinaryVideo"

export function ProjectDetail({ project, index, total, onClose, onStep, videoMode, copy, language, onLanguageChange }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    const overflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = "hidden"
    closeRef.current.focus()
    return () => {
      dialog.close()
      document.body.style.overflow = overflow
    }
  }, [])

  useEffect(() => { dialogRef.current.scrollTop = 0 }, [project.id])

  return createPortal(
    <dialog ref={dialogRef} className="project-dialog" aria-labelledby="detail-title" onCancel={(event) => { event.preventDefault(); onClose() }}>
      <div className="detail-toolbar">
        <a className="wordmark" href="#work" onClick={(event) => { event.preventDefault(); onClose() }}>Gastón Acuña<span>.</span></a>
        <div className="detail-tools">
          <div className="languages" role="group" aria-label={copy.nav.language}>
            {["en", "es"].map((locale) => <button key={locale} type="button" aria-pressed={language === locale} onClick={() => onLanguageChange(locale)}>{locale.toUpperCase()}</button>)}
          </div>
          <button type="button" ref={closeRef} className="icon-button" onClick={onClose} aria-label={copy.detail.close} title={copy.detail.close}><X size={24} /></button>
        </div>
      </div>
      <div className="detail-layout">
        <div className="detail-heading"><p className="eyebrow">{project.category}</p><h2 id="detail-title">{project.title}</h2></div>
        <div className="detail-video"><CloudinaryVideo key={project.id} src={project.videoSrc} title={project.title} videoMode={videoMode} copy={copy.detail} /></div>
        <div className="detail-copy">
          <dl className="detail-meta">
            {[[copy.detail.role, project.role], [copy.detail.format, project.format], [copy.detail.year, project.year], [copy.detail.client, project.client]].filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
          {[[copy.detail.context, project.context || project.description], [copy.detail.approach, project.approach], [copy.detail.outcome, project.outcome]].filter(([, value]) => value).map(([label, value]) => <div className="detail-paragraph" key={label}><h3>{label}</h3><p>{value}</p></div>)}
        </div>
      </div>
      <div className="detail-navigation">
        <button type="button" className="text-link" onClick={() => onStep(-1)}><ArrowLeft size={20} aria-hidden="true" /><span>{copy.detail.previous}</span></button>
        <span className="detail-position" aria-live="polite">{index + 1} / {total}</span>
        <button type="button" className="text-link" onClick={() => onStep(1)}><span>{copy.detail.next}</span><ArrowRight size={20} aria-hidden="true" /></button>
      </div>
    </dialog>, document.body,
  )
}
