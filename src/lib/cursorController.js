const textTargets = "p,h1,h2,h3,blockquote,span,em,strong,li,dt,dd,label"
const shortestTurn = angle => ((angle + 540) % 360 + 360) % 360 - 180

function directionPose(dx, dy) {
  // The centered SVG points up at rest; velocity determines its destination,
  // while the controller below supplies the angular inertia.
  return Math.atan2(dy, dx) * 180 / Math.PI + 90
}

function textRegions(target) {
  if (!target?.closest(textTargets) || getComputedStyle(target).userSelect === "none") return []
  const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT)
  const range = document.createRange(), rects = []
  let text
  // Range rectangles follow the actual words and wrapped lines. Cache them
  // until the target/layout changes; no caret snapping or per-frame layout reads.
  while ((text = walker.nextNode())) {
    if (text.parentElement.closest("[aria-hidden=true]")) continue
    for (const word of text.textContent.matchAll(/\S+/gu)) {
      range.setStart(text, word.index)
      range.setEnd(text, word.index + word[0].length)
      rects.push(...range.getClientRects())
    }
  }
  return rects
}

export function mountCursor(node) {
  if (typeof node.showPopover !== "function") return () => {}
  const fine = matchMedia("(pointer: fine)")
  let disposeActive = () => {}
  function configure() {
    disposeActive()
    disposeActive = fine.matches ? activateCursor(node) : () => {}
  }
  configure()
  fine.addEventListener("change", configure)
  return () => { fine.removeEventListener("change", configure); disposeActive() }
}

function activateCursor(node) {
  const root = document.documentElement
  const label = node.querySelector(".cursor-label")
  const reduced = matchMedia("(prefers-reduced-motion: reduce)")
  const listeners = new AbortController()
  let disposed = false, frame = null, present = false, known = false, inside = false, dragging = false
  let x = 0, y = 0, previousX = 0, previousY = 0, lastInput = 0, lastFrame = 0
  let orientation = -35, targetOrientation = -35, stretch = 0, skew = 0
  let dirty = true, native = false, selecting = false, state = "default", geometry = null, textGeometry = null
  function overText(target, px, py) {
    if (textGeometry?.target !== target) textGeometry = { target, rects: textRegions(target) }
    return textGeometry.rects.some(r => px >= r.left && px <= r.right && py >= r.top && py <= r.bottom)
  }

  function resetMotion() {
    previousX = x; previousY = y; lastFrame = 0
    targetOrientation = orientation
    stretch = 0; skew = 0
  }
  function hide() {
    root.removeAttribute("data-cursor-active")
    node.dataset.visible = "false"
    if (node.matches(":popover-open")) node.hidePopover()
  }
  function suspend() {
    present = false; selecting = false
    node.dataset.press = "false"
    if (frame !== null) cancelAnimationFrame(frame)
    frame = null
    resetMotion()
    hide()
  }
  function schedule() {
    if (!disposed && present && !document.hidden && !dragging && frame === null) frame = requestAnimationFrame(update)
  }
  function refresh() { dirty = true; geometry = null; textGeometry = null; schedule() }
  function classify() {
    dirty = false
    const target = document.elementFromPoint(x, y)
    const action = target?.closest("a,button,[data-cursor]")
    // Browser-owned video controls include a central play affordance and can
    // capture the pointer; use native throughout the controlled video surface.
    native = !target || Boolean(target.closest("video[controls],iframe,input,textarea,select,[contenteditable]:not([contenteditable=false])")) || Boolean(action?.disabled)
    if (native) return
    let text = false
    if (!action && !selecting) {
      text = overText(target, x, y)
      geometry = null
    }
    const next = action ? action.dataset.copied === "true" ? "copied" : action.dataset.cursor || "link" : selecting || text ? "text" : "default"
    if (next !== state || node.dataset.state !== next) {
      state = next
      node.dataset.state = next
      label.textContent = ({ project: "VIEW", copy: "COPY", copied: "COPIED" })[next] || ""
    }
    // Cache only stable action regions. Text and empty space must be hit-tested
    // when coordinates change, never during the orientation-only settle frames.
    if (action && !geometry) geometry = { target: action, rect: action.getBoundingClientRect() }
  }
  function update(now) {
    frame = null
    if (disposed || !present || document.hidden || dragging) return
    try {
      if (dirty) classify()
      if (native) { resetMotion(); hide(); return }
      const dt = lastFrame ? Math.min(32, Math.max(1, now - lastFrame)) : 16
      lastFrame = now
      const dx = x - previousX, dy = y - previousY
      previousX = x; previousY = y
      const speed = Math.hypot(dx, dy) / dt
      const moving = speed > .025 && state !== "text" && !reduced.matches
      if (moving) targetOrientation = directionPose(dx, dy)
      const turn = shortestTurn(targetOrientation - orientation)
      if (!reduced.matches && state !== "text") {
        const response = moving ? 65 - Math.min(25, speed * 12) : 55
        orientation += Math.max(-dt * 3, Math.min(dt * 3, turn * (1 - Math.exp(-dt / response))))
        orientation = (orientation + 360) % 360
      }
      const blend = 1 - Math.exp(-dt / 28)
      stretch += ((moving ? Math.min(.09, speed * .035) : 0) - stretch) * blend
      skew += ((moving ? Math.max(-2.5, Math.min(2.5, -turn * .045)) : 0) - skew) * blend
      if (reduced.matches || state === "text") { stretch = 0; skew = 0; targetOrientation = orientation }
      if (stretch < .001) stretch = 0
      if (Math.abs(skew) < .02) skew = 0
      const turning = !reduced.matches && state !== "text" && Math.abs(shortestTurn(targetOrientation - orientation)) > .15
      if (!turning) orientation = targetOrientation
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`
      node.style.setProperty("--cursor-drift", `${orientation}deg`)
      node.style.setProperty("--cursor-stretch", `${1 + stretch}`)
      node.style.setProperty("--cursor-skew", `${skew}deg`)
      node.dataset.labelSide = x > innerWidth - 110 ? "left" : "right"
      if (!node.matches(":popover-open")) node.showPopover()
      node.dataset.visible = "true"
      root.dataset.cursorActive = "true"
      if (moving || turning || stretch || skew) schedule()
    } catch {
      // A detached hit target or interrupted top-layer operation must never
      // leave a frozen custom arrow with the system cursor suppressed.
      resetMotion(); hide(); dirty = true
    }
  }
  function move(event) {
    if (event.pointerType && event.pointerType !== "mouse") { inside = false; return suspend() }
    // Native drag suppresses pointermove. Its first subsequent mouse event is
    // also a recovery signal if dragend was lost outside the browser window.
    if (dragging && event.type !== "pointermove") return
    dragging = false
    const now = performance.now()
    x = event.clientX; y = event.clientY
    inside = x >= 0 && y >= 0 && x < innerWidth && y < innerHeight
    if (!inside) return suspend()
    known = true
    if (!present || now - lastInput > 180) resetMotion()
    lastInput = now; present = true
    const r = geometry?.rect
    if (!r || !geometry.target.isConnected || x < r.left || x > r.right || y < r.top || y > r.bottom || !geometry.target.contains(event.target)) {
      dirty = true; geometry = null
    }
    schedule()
  }
  function leave(event) {
    if (event.relatedTarget === null && (event.type === "pointerleave" || event.clientX <= 0 || event.clientY <= 0 || event.clientX >= innerWidth || event.clientY >= innerHeight)) {
      inside = false; suspend()
    }
  }
  function resume() {
    if (!known || !inside || document.hidden || dragging) return
    resetMotion(); present = true; refresh()
  }
  function down(event) {
    move(event)
    if (!present) return
    const target = event.target instanceof Element ? event.target : null
    selecting = !target?.closest("a,button,[data-cursor],video,input,textarea,select,[contenteditable]") && overText(target, x, y)
    node.dataset.press = "true"
    refresh()
  }
  function up(event) { selecting = false; node.dataset.press = "false"; move(event); refresh() }
  function dragStart() { dragging = true; suspend() }
  function dragEnd(event) { dragging = false; if (event.clientX || event.clientY) move(event) }
  function on(target, type, handler, options = {}) {
    target.addEventListener(type, handler, { capture: true, passive: true, ...options, signal: listeners.signal })
  }
  on(window, "pointermove", move)
  on(window, "pointerover", move)
  on(root, "pointerenter", move)
  on(root, "pointerleave", leave)
  on(window, "pointerout", leave)
  on(window, "pointerdown", down)
  on(window, "pointerup", up)
  on(window, "pointercancel", suspend)
  on(window, "lostpointercapture", refresh)
  on(window, "dragstart", dragStart)
  on(window, "dragend", dragEnd)
  on(window, "blur", suspend)
  on(window, "focus", resume)
  on(window, "pagehide", suspend)
  on(window, "pageshow", resume)
  on(document, "visibilitychange", () => document.hidden ? suspend() : resume())
  on(window, "keydown", event => { if (event.key === "Tab") suspend() })
  on(window, "scroll", refresh)
  on(window, "resize", refresh)
  on(window, "popstate", refresh)
  on(document, "animationend", refresh)
  on(document, "transitionend", refresh)
  on(document, "fullscreenchange", refresh)
  on(node, "toggle", () => { if (!node.matches(":popover-open")) { root.removeAttribute("data-cursor-active"); schedule() } })
  on(reduced, "change", () => { resetMotion(); refresh() })
  const changes = new MutationObserver(records => {
    const relevant = records.filter(record => !node.contains(record.target))
    if (!relevant.length) return
    if (relevant.some(record => record.type === "childList" && [...record.addedNodes].some(n => n instanceof Element && (n.matches("dialog") || n.querySelector("dialog"))) || record.target instanceof HTMLDialogElement && record.attributeName === "open")) hide()
    refresh()
  })
  changes.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["open", "data-copied", "disabled", "data-ready", "data-phase", "lang"] })
  return () => {
    disposed = true
    listeners.abort(); changes.disconnect(); suspend()
  }
}
