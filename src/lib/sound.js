// Interface sound, synthesized with Web Audio: no files to load, nothing licensed.
// Off by default; the visitor turns it on and the choice is remembered.
const STORAGE_KEY = "portfolio-sound"
const listeners = new Set()
let enabled = false
let context = null
let master = null
let noise = null

try { enabled = window.localStorage.getItem(STORAGE_KEY) === "on" } catch { /* Storage can be blocked. */ }

function audio() {
  if (typeof window === "undefined" || !(window.AudioContext || window.webkitAudioContext)) return null
  if (!context) {
    context = new (window.AudioContext || window.webkitAudioContext)()
    master = context.createGain()
    master.gain.value = 0.5
    master.connect(context.destination)
    noise = context.createBuffer(1, context.sampleRate * 0.5, context.sampleRate)
    const data = noise.getChannelData(0)
    for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1
  }
  if (context.state === "suspended") context.resume().catch(() => {})
  return context
}

function envelope(ctx, peak, attack, release, start = ctx.currentTime) {
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(peak, start + attack)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + attack + release)
  gain.connect(master)
  return gain
}

function burst(ctx, { type, frequency, q = 1, peak, attack, release, sweepTo }) {
  const source = ctx.createBufferSource()
  source.buffer = noise
  const filter = ctx.createBiquadFilter()
  filter.type = type
  filter.frequency.setValueAtTime(frequency, ctx.currentTime)
  if (sweepTo) filter.frequency.exponentialRampToValueAtTime(sweepTo, ctx.currentTime + attack + release)
  filter.Q.value = q
  source.connect(filter).connect(envelope(ctx, peak, attack, release))
  source.start()
  source.stop(ctx.currentTime + attack + release + 0.02)
}

const sounds = {
  // A soft tick, for hovering things that can be opened.
  tick(ctx) {
    burst(ctx, { type: "bandpass", frequency: 3800, q: 6, peak: 0.12, attack: 0.001, release: 0.025 })
  },
  // The splice: a blade click over a short low thump.
  cut(ctx) {
    burst(ctx, { type: "highpass", frequency: 2400, peak: 0.22, attack: 0.001, release: 0.04 })
    const osc = ctx.createOscillator()
    osc.type = "sine"
    osc.frequency.setValueAtTime(140, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(52, ctx.currentTime + 0.09)
    osc.connect(envelope(ctx, 0.35, 0.002, 0.1))
    osc.start()
    osc.stop(ctx.currentTime + 0.12)
  },
  // Air moving past: opening and closing a project.
  whoosh(ctx) {
    burst(ctx, { type: "bandpass", frequency: 500, sweepTo: 3200, q: 0.9, peak: 0.18, attack: 0.12, release: 0.26 })
  },
}

export function play(name) {
  if (!enabled) return
  const ctx = audio()
  if (ctx && sounds[name]) sounds[name](ctx)
}

export function isSoundOn() {
  return enabled
}

export function setSound(next) {
  enabled = next
  try { window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off") } catch { /* Storage can be blocked. */ }
  if (next) audio()
  listeners.forEach((listener) => listener(enabled))
  if (next) play("tick")
}

export function subscribeSound(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
