import { useEffect, useState } from "react"

export function useCompactLayout() {
  const [isCompact, setIsCompact] = useState(() => window.matchMedia("(max-width: 760px)").matches)

  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px)")
    const update = () => setIsCompact(query.matches)
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  return isCompact
}

