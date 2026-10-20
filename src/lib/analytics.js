// Visit counts with GoatCounter: no cookies, no personal data, so no consent banner.
// Set the site code once the GoatCounter account exists (https://<code>.goatcounter.com).
const GOATCOUNTER_CODE = "gastonaar"

let loaded = false

export function startAnalytics() {
  if (loaded || !GOATCOUNTER_CODE || typeof document === "undefined") return
  loaded = true
  const script = document.createElement("script")
  script.async = true
  script.src = "https://gc.zgo.at/count.js"
  script.dataset.goatcounter = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`
  document.head.append(script)
}

// Events show up next to page views, e.g. which projects get opened.
export function track(name, title = name) {
  if (!GOATCOUNTER_CODE) return
  const send = () => window.goatcounter?.count?.({ path: name, title, event: true })
  if (window.goatcounter?.count) send()
  else window.addEventListener("load", send, { once: true })
}
