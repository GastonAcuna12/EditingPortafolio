import { useEffect, useRef, useState } from "react"
import { contact } from "../data/portfolio"

export function useCopyEmail() {
  const [copied, setCopied] = useState(false)
  const timeout = useRef(null)
  useEffect(() => () => window.clearTimeout(timeout.current), [])

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contact.email)
      window.clearTimeout(timeout.current)
      setCopied(true)
      timeout.current = window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${contact.email}`
    }
  }
  return { copied, copyEmail }
}

