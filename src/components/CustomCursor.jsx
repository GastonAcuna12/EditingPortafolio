import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { mountCursor } from "../lib/cursorController"

export function CustomCursor() {
  const ref = useRef(null)
  useEffect(() => mountCursor(ref.current), [])
  return createPortal(<div ref={ref} popover="manual" className="custom-cursor" data-state="default" aria-hidden="true">
    <span className="cursor-face"><span className="cursor-drift">
      <svg className="cursor-pointer" width="24" height="28" viewBox="-12 -14 24 28" fill="none">
        <path d="M0 -12 10 11 0 6 -10 11Z" fill="#eee9df" />
        <path d="M0 -8.5 7.3 8.1 0 4.4 -7.3 8.1Z" stroke="#141414" strokeWidth="1" strokeLinejoin="round" />
      </svg>
    </span></span>
    <svg className="cursor-text" width="14" height="26" viewBox="0 0 14 26" fill="none">
      <path d="M3 3h8M7 3v20M3 23h8" stroke="#141414" strokeWidth="4" strokeLinecap="round" />
      <path d="M3 3h8M7 3v20M3 23h8" stroke="#eee9df" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
    <span className="cursor-label" />
  </div>, document.body)
}
