import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { ArrowLeft, ArrowRight, X } from "lucide-react"
import { CloudinaryVideo } from "./media/CloudinaryVideo"
import { getCloudinaryVideoPoster, getCloudinaryPosterSrcSet } from "../lib/cloudinary"
import { useProjectTransition } from "../hooks/useProjectTransition"

export function ProjectDetail({ project, index, total, origin, closing, onClosed, onClose, onStep, videoMode, copy, language, onLanguageChange }) {
  const dialogRef = useRef(null)
  const frameRef = useRef(null)
  const flightRef = useRef(null)
  const surfaceRef = useRef(null)
  const backdropRef = useRef(null)
  const ready = useProjectTransition({ dialogRef, frameRef, flightRef, surfaceRef, backdropRef, origin, projectId: project.id, closing, onClosed })
  const poster = getCloudinaryVideoPoster(project.videoSrc, videoMode, project.posterSecond ?? 1)

  useEffect(() => { dialogRef.current.scrollTop = 0 }, [project.id])

  return createPortal(
    <dialog ref={dialogRef} className="project-dialog" data-phase={closing ? "closing" : ready ? "ready" : "opening"} aria-labelledby="detail-title" onCancel={(event) => { event.preventDefault(); onClose() }}>
      <div className="detail-backdrop" ref={backdropRef} aria-hidden="true" />
      <div className="detail-surface" ref={surfaceRef}>
      <div className="detail-toolbar">
        <a className="wordmark" href="#work" onClick={(event) => { event.preventDefault(); onClose() }}>Gastón Acuña<span>.</span></a>
        <div className="detail-tools">
          <div className="languages" role="group" aria-label={copy.nav.language}>
            {["en", "es"].map((locale) => <button key={locale} type="button" disabled={!ready || closing} aria-pressed={language === locale} onClick={() => onLanguageChange(locale)}>{locale.toUpperCase()}</button>)}
          </div>
          <button type="button" autoFocus className="icon-button" onClick={onClose} disabled={closing} aria-label={copy.detail.close} title={copy.detail.close}><X size={24} /></button>
        </div>
      </div>
      <div className="detail-layout">
        <div className="detail-heading"><p className="eyebrow">{project.category}</p><h2 id="detail-title">{project.title}</h2></div>
        <div className="detail-intro">
          <dl className="detail-meta">
            {[[copy.detail.role, project.role], [copy.detail.format, project.format], [copy.detail.year, project.year], [copy.detail.client, project.client]].filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
          <p className="detail-summary">{project.intro || project.context}</p>
        </div>
        <div className="detail-video">
          <div ref={frameRef} className="detail-media-frame">
            <img className="detail-poster" src={poster} srcSet={getCloudinaryPosterSrcSet(project.videoSrc, project.posterSecond ?? 1)} sizes="(max-width: 639px) calc(100vw - 40px), 440px" alt="" width="540" height="960" />
            {ready && !closing && <CloudinaryVideo key={project.id} src={project.videoSrc} posterSrc={poster} title={project.title} videoMode={videoMode} copy={copy.detail} />}
          </div>
        </div>
        <div className="detail-copy">
          {[[copy.detail.context, project.context || project.description], [copy.detail.approach, project.approach], [copy.detail.outcome, project.outcome]].filter(([, value]) => value).map(([label, value]) => <div className="detail-paragraph" key={label}><h3>{label}</h3><p>{value}</p></div>)}
        </div>
      </div>
      <div className="detail-navigation">
        <button type="button" className="text-link" disabled={!ready || closing} onClick={() => onStep(-1)}><ArrowLeft size={20} aria-hidden="true" /><span>{copy.detail.previous}</span></button>
        <span className="detail-position" aria-live="polite">{index + 1} / {total}</span>
        <button type="button" className="text-link" disabled={!ready || closing} onClick={() => onStep(1)}><span>{copy.detail.next}</span><ArrowRight size={20} aria-hidden="true" /></button>
      </div>
      </div>
      <img ref={flightRef} className="transition-poster" src={!ready && origin?.src ? origin.src : poster} alt="" aria-hidden="true" />
    </dialog>, document.body,
  )
}
