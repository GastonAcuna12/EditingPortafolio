import { useEffect, useRef } from "react"
import { timing } from "../lib/motion"

// One sampled silhouette of the actual Hero glyphs, replaced by live text.
export function RasterReveal({ children, className = "", duration = timing.heroRaster }) {
  const ref = useRef(null)
  useEffect(() => {
    const node = ref.current
    const text = node.querySelector(".raster-content")
    const pixels = node.querySelector(".raster-pixels")
    const reduced = matchMedia("(prefers-reduced-motion: reduce)")
    let disposed = false
    let animations = []
    const finish = () => {
      node.dataset.raster = "resolved"
      animations.forEach(animation => animation.cancel())
      animations = []
      pixels.replaceChildren()
    }
    async function start() {
      // Keep readable text while fonts load; never strand an invisible heading.
      if (reduced.matches) return
      await document.fonts.ready
      if (disposed || reduced.matches) return
      try {
        const style = getComputedStyle(text)
        const { width, height } = text.getBoundingClientRect()
        const canvas = document.createElement("canvas")
        canvas.width = Math.ceil(width); canvas.height = Math.ceil(height)
        const context = canvas.getContext("2d", { willReadFrequently: true })
        context.font = style.fontStyle + " " + style.fontWeight + " " + style.fontSize + " " + style.fontFamily
        const metrics = context.measureText(children)
        const ascent = metrics.fontBoundingBoxAscent ?? metrics.actualBoundingBoxAscent
        const descent = metrics.fontBoundingBoxDescent ?? metrics.actualBoundingBoxDescent
        context.fillText(children, 0, (height - ascent - descent) / 2 + ascent)
        const { data } = context.getImageData(0, 0, canvas.width, canvas.height)
        const step = Math.max(3, Math.round(parseFloat(style.fontSize) / 15))
        let path = ""
        for (let y = 0; y < canvas.height; y += step) {
          for (let x = 0; x < canvas.width; x += step) {
            let alpha = 0, count = 0
            for (let py = y; py < Math.min(y + step, canvas.height); py++) {
              for (let px = x; px < Math.min(x + step, canvas.width); px++) {
                alpha += data[(py * canvas.width + px) * 4 + 3]; count++
              }
            }
            if (alpha / count > 35) path += "M" + x + " " + y + "h" + step + "v" + step + "h-" + step + "Z"
          }
        }
        canvas.width = 0; canvas.height = 0
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        svg.setAttribute("viewBox", "0 0 " + width + " " + height)
        svg.setAttribute("width", width); svg.setAttribute("height", height)
        const silhouette = document.createElementNS(svg.namespaceURI, "path")
        silhouette.setAttribute("d", path); silhouette.setAttribute("fill", "currentColor")
        svg.append(silhouette); pixels.append(svg)
        node.dataset.raster = "running"
        const clean = [], coarse = []
        for (let i = 0; i <= 6; i++) {
          const front = i / 6 * 120
          const left = Math.max(0, Math.min(100, front - 20))
          const right = Math.max(0, 100 - front)
          clean.push({ offset: i / 6, clipPath: "inset(0 " + (100 - left) + "% 0 0)" })
          coarse.push({ offset: i / 6, clipPath: "inset(0 " + right + "% 0 " + left + "%)" })
        }
        animations = [text.animate(clean, { duration, easing: "linear", fill: "both" }), pixels.animate(coarse, { duration, easing: "linear", fill: "both" })]
        Promise.all(animations.map(animation => animation.finished)).then(() => { if (!disposed) finish() }).catch(() => {})
      } catch { finish() }
    }
    const preferenceChange = () => { if (reduced.matches) finish() }
    reduced.addEventListener("change", preferenceChange)
    window.addEventListener("resize", finish)
    start()
    return () => { disposed = true; finish(); reduced.removeEventListener("change", preferenceChange); window.removeEventListener("resize", finish) }
  }, [children, duration])
  return <span ref={ref} className={"raster-reveal " + className}>
    <span className="raster-content">{children}</span>
    <span className="raster-pixels" aria-hidden="true" />
  </span>
}
