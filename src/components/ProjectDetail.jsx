import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react"
import { VideoHandoff } from "./VideoHandoff"
import { FormatSet } from "./FormatSet"
import { RATIOS } from "../lib/formats"
import { getCloudinaryVideoPoster, getCloudinaryPosterSrcSet, isWideProject } from "../lib/cloudinary"
import { useProjectTransition } from "../hooks/useProjectTransition"

export function ProjectDetail({ project, index, total, origin, closing, onClosed, onClose, onStep, videoMode, copy, language, onLanguageChange }) {
  const dialogRef = useRef(null)
  const frameRef = useRef(null)
  const flightRef = useRef(null)
  const surfaceRef = useRef(null)
  const backdropRef = useRef(null)
  const ready = useProjectTransition({ dialogRef, frameRef, flightRef, surfaceRef, backdropRef, origin, projectId: project.id, closing, onClosed })
  // Pieces delivered in several sizes can switch between them, or show them all at once.
  const formats = project.sizes ? [[project.format, project.videoSrc], ...Object.entries(project.sizes)] : null
  const [viewState, setViewState] = useState({ id: project.id, view: project.format })
  const view = viewState.id === project.id ? viewState.view : project.format
  const setView = (next) => setViewState({ id: project.id, view: next })
  const source = formats?.find(([ratio]) => ratio === view)?.[1] || project.videoSrc
  const wide = view === "all" || view === "16:9" || isWideProject(project)
  const poster = getCloudinaryVideoPoster(source, videoMode, project.posterSecond ?? 1, wide ? 1280 : undefined)
  const [firstId] = useState(project.id)

  useEffect(() => { dialogRef.current.scrollTop = 0 }, [project.id])

  return createPortal(
    <dialog ref={dialogRef} className="project-dialog" data-ready={ready} data-phase={closing ? "closing" : ready ? "ready" : "opening"} aria-labelledby="detail-title" onCancel={(event) => { event.preventDefault(); onClose() }}>
      <div className="detail-backdrop" ref={backdropRef} aria-hidden="true" />
      {project.id !== firstId && <span key={project.id} className="detail-cut" aria-hidden="true" />}
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
      <div className="detail-layout" data-wide={wide || undefined}>
        <div className="detail-heading"><p className="eyebrow">{project.category}</p><h2 id="detail-title">{project.title}</h2></div>
        <div className="detail-intro">
          <dl className="detail-meta">
            {[[copy.detail.role, project.role], [copy.detail.format, project.format], [copy.detail.year, project.year], [copy.detail.client, project.client]].filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
          <p className="detail-summary">{project.intro || project.context}</p>
          {project.playUrl && <a className="text-link detail-play" data-cursor="cta" href={project.playUrl} target="_blank" rel="noopener">{copy.detail.playIt}<ArrowUpRight size={18} aria-hidden="true" /></a>}
        </div>
        <div className="detail-video">
          <div ref={frameRef} className="detail-media-frame" data-set={view === "all" || undefined} style={{ "--ar": RATIOS[view] || RATIOS[project.format] }}>
            {view === "all" ? <FormatSet formats={formats} posterSecond={project.posterSecond ?? 1} videoMode={videoMode} label={copy.detail.allFormats} /> : <>
            <img className="detail-poster" src={poster} srcSet={getCloudinaryPosterSrcSet(source, project.posterSecond ?? 1, wide)} sizes={wide ? "(max-width: 639px) calc(100vw - 40px), min(100vw - 112px, 1260px)" : "(max-width: 639px) calc(100vw - 40px), 440px"} alt="" width={wide ? 1280 : 540} height={wide ? 720 : 960} />
            {ready && !closing && <VideoHandoff key={`${project.id}-${view}`} src={source} posterSrc={poster} title={project.title} videoMode={videoMode} wide={wide} copy={copy.detail} />}
            </>}
          </div>
          {formats && <div className="format-switch" role="group" aria-label={copy.detail.formats}>
            {[...formats.map(([ratio]) => ratio), "all"].map((ratio) => <button key={ratio} type="button" aria-pressed={view === ratio} disabled={!ready || closing} onClick={() => setView(ratio)}>{ratio === "all" ? copy.detail.allFormats : ratio}</button>)}
          </div>}
        </div>
        <div className="detail-copy">
          {[[copy.detail.context, project.context || project.description], [copy.detail.approach, project.approach], [copy.detail.outcome, project.outcome]].filter(([, value]) => value).map(([label, value]) => <div className="detail-paragraph" key={label}><h3>{label}</h3><p>{value}</p></div>)}
        </div>
      </div>
      <div className="detail-navigation">
        <button type="button" className="text-link" disabled={!ready || closing} onClick={() => onStep(-1)}><ArrowLeft size={20} aria-hidden="true" /><span>{copy.detail.previous}</span></button>
        <span className="detail-position" aria-live="polite"><span className="visually-hidden">{project.title}, </span>{index + 1} / {total}</span>
        <button type="button" className="text-link" disabled={!ready || closing} onClick={() => onStep(1)}><span>{copy.detail.next}</span><ArrowRight size={20} aria-hidden="true" /></button>
      </div>
      </div>
      <img ref={flightRef} className="transition-poster" src={!ready && origin?.src ? origin.src : poster} alt="" aria-hidden="true" />
    </dialog>, document.body,
  )
}
