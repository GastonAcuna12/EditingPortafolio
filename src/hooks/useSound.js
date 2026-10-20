import { useSyncExternalStore } from "react"
import { isSoundOn, setSound, subscribeSound } from "../lib/sound"

export function useSound() {
  const on = useSyncExternalStore(subscribeSound, isSoundOn, () => false)
  return [on, () => setSound(!on)]
}
