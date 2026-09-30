import { useSyncExternalStore } from "react"
import type { MouseEvent } from "react"

const subscribe = (callback: () => void) => {
  window.addEventListener("popstate", callback)
  return () => window.removeEventListener("popstate", callback)
}

export function usePath() {
  return useSyncExternalStore(subscribe, () => window.location.pathname)
}

export function navigate(to: string) {
  window.history.pushState(null, "", to)
  window.dispatchEvent(new PopStateEvent("popstate"))
  window.scrollTo(0, 0)
}

// onClick handler for internal <a> links; keeps ctrl/cmd-click opening a new tab
export function linkTo(to: string) {
  return (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    navigate(to)
  }
}
