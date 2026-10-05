import { useSyncExternalStore } from "react"

export type Lang = "tr" | "en"
/** A string in both languages */
export type Text = { tr: string; en: string }

const KEY = "lang"
const listeners = new Set<() => void>()

function initial(): Lang {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === "tr" || saved === "en") return saved
  } catch {
    // storage blocked: fall back to the browser language
  }
  return navigator.language.toLowerCase().startsWith("tr") ? "tr" : "en"
}

let current: Lang = initial()
document.documentElement.lang = current

export function setLang(lang: Lang) {
  current = lang
  document.documentElement.lang = lang
  try {
    localStorage.setItem(KEY, lang)
  } catch {
    // not persisted, still switches for this visit
  }
  listeners.forEach((l) => l())
}

export function useLang(): Lang {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => current
  )
}

/** t("Türkçe", "English") or t({ tr, en }) */
export function useT() {
  const lang = useLang()
  function t(text: Text): string
  function t(tr: string, en: string): string
  function t(a: Text | string, b?: string) {
    if (typeof a === "string") return lang === "tr" ? a : b!
    return a[lang]
  }
  return t
}
