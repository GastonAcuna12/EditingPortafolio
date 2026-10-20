const STORAGE_KEY = "portfolio-language"
const SUPPORTED = ["en", "es"]

// A choice the visitor made wins; otherwise follow the browser, falling back to English.
export function initialLanguage(stored, preferred = []) {
  if (SUPPORTED.includes(stored)) return stored
  for (const locale of preferred) {
    const base = String(locale).toLowerCase().split("-")[0]
    if (SUPPORTED.includes(base)) return base
  }
  return "en"
}

export function readLanguage() {
  let stored = null
  try { stored = window.localStorage.getItem(STORAGE_KEY) } catch { /* Storage can be blocked. */ }
  return initialLanguage(stored, navigator.languages?.length ? navigator.languages : [navigator.language])
}

export function saveLanguage(language) {
  try { window.localStorage.setItem(STORAGE_KEY, language) } catch { /* Storage can be blocked. */ }
}
