import test from "node:test"
import assert from "node:assert/strict"
import { mountCursor } from "../src/lib/cursorController.js"

function environment(finePointer = true) {
  const originals = new Map()
  const install = (key, value) => { originals.set(key, Object.getOwnPropertyDescriptor(globalThis, key)); Object.defineProperty(globalThis, key, { configurable: true, writable: true, value }) }
  const window = new EventTarget(), document = new EventTarget(), root = new EventTarget(), node = new EventTarget()
  const fine = new EventTarget(), reduced = new EventTarget()
  fine.matches = finePointer; reduced.matches = false
  const frames = new Map(), label = { textContent: "" }, properties = {}
  let nextId = 0, time = 0, open = false, target
  root.dataset = {}
  root.removeAttribute = () => { delete root.dataset.cursorActive }
  node.dataset = { state: "default" }
  node.style = { setProperty: (key, value) => { properties[key] = value } }
  node.querySelector = () => label
  node.matches = () => open
  node.showPopover = () => { open = true }
  node.hidePopover = () => { open = false }
  node.contains = () => false
  document.documentElement = root; document.body = {}; document.hidden = false
  class Element { closest() { return null } }
  target = new Element()
  document.elementFromPoint = () => target
  install("Element", Element)
  install("HTMLDialogElement", class extends Element {})
  install("window", window); install("document", document)
  install("innerWidth", 1440); install("innerHeight", 1000)
  install("matchMedia", query => query.includes("pointer: fine") ? fine : reduced)
  install("MutationObserver", class { observe() {} disconnect() {} })
  install("requestAnimationFrame", callback => { const id = ++nextId; frames.set(id, callback); return id })
  install("cancelAnimationFrame", id => frames.delete(id))
  const emit = (subject, type, values = {}) => { const event = new Event(type); Object.assign(event, values); subject.dispatchEvent(event) }
  const move = (x, y) => emit(window, "pointermove", { pointerType: "mouse", clientX: x, clientY: y })
  const tick = () => { const pending = [...frames.values()]; frames.clear(); time += 16; pending.forEach(callback => callback(time)) }
  const settle = () => { for (let i = 0; i < 100 && frames.size; i++) tick(); assert.equal(frames.size, 0, "cursor must stop scheduling when idle") }
  return { window, document, root, node, fine, frames, properties, emit, move, tick, settle,
    restore() { for (const [key, descriptor] of originals) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key] } },
  }
}

test("cursor recovers after focus, visibility and pointer cancellation without a stale RAF", () => {
  const env = environment()
  const cleanup = mountCursor(env.node)
  try {
    env.move(120, 140); env.tick()
    assert.equal(env.node.dataset.visible, "true")
    env.move(600, 400)
    assert.equal(env.frames.size, 1)
    env.emit(env.window, "blur")
    assert.equal(env.frames.size, 0)
    assert.equal(env.node.dataset.visible, "false")
    env.emit(env.window, "focus"); env.tick()
    assert.equal(env.node.dataset.visible, "true")
    assert.equal(env.node.style.transform, "translate3d(600px, 400px, 0)")
    env.document.hidden = true; env.emit(env.document, "visibilitychange")
    assert.equal(env.frames.size, 0)
    env.document.hidden = false; env.emit(env.document, "visibilitychange"); env.tick()
    assert.equal(env.node.dataset.visible, "true")
    env.emit(env.window, "pointercancel")
    assert.equal(env.node.dataset.visible, "false")
    assert.equal(env.root.dataset.cursorActive, undefined)
    env.move(800, 500); env.tick(); env.settle()
    assert.equal(env.node.style.transform, "translate3d(800px, 500px, 0)")
    assert.equal(env.properties["--cursor-stretch"], "1")
  } finally { cleanup(); env.restore() }
})

test("cursor relinquishes native drags and recovers on real viewport re-entry", () => {
  const env = environment(), cleanup = mountCursor(env.node)
  try {
    env.move(200, 300); env.tick()
    env.emit(env.window, "dragstart")
    assert.equal(env.node.dataset.visible, "false")
    assert.equal(env.frames.size, 0)
    env.emit(env.window, "dragend", { clientX: 400, clientY: 500 }); env.tick()
    assert.equal(env.node.dataset.visible, "true")
    env.emit(env.window, "dragstart")
    env.move(450, 500); env.tick()
    assert.equal(env.node.dataset.visible, "true", "first real pointermove recovers even if dragend was lost")
    env.emit(env.root, "pointerleave", { relatedTarget: null, clientX: 500, clientY: 0 })
    env.emit(env.window, "focus")
    assert.equal(env.frames.size, 0, "focus alone must not resurrect a cursor outside the viewport")
    env.move(700, 600); env.tick()
    assert.equal(env.node.style.transform, "translate3d(700px, 600px, 0)")
  } finally { cleanup(); env.restore() }
})

test("touch installs no movement work; fine-pointer switching and remount clean up", () => {
  const env = environment(false)
  let cleanup = mountCursor(env.node)
  try {
    env.move(100, 200)
    assert.equal(env.frames.size, 0)
    env.fine.matches = true; env.emit(env.fine, "change")
    env.move(200, 300); env.tick()
    assert.equal(env.node.dataset.visible, "true")
    env.fine.matches = false; env.emit(env.fine, "change")
    assert.equal(env.frames.size, 0)
    assert.equal(env.node.dataset.visible, "false")
    cleanup()
    env.fine.matches = true
    cleanup = mountCursor(env.node)
    env.move(400, 500)
    assert.equal(env.frames.size, 1, "only the current controller should schedule")
    env.tick(); env.settle(); cleanup()
    env.move(700, 800)
    assert.equal(env.frames.size, 0)
  } finally { cleanup(); env.restore() }
})
