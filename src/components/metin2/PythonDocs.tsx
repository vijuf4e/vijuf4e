import { useEffect, useMemo, useRef, useState } from "react"
import type { MouseEvent } from "react"
import { Search } from "lucide-react"
import { useLang, useT } from "@/lib/i18n"
import { buildDoc } from "@/lib/xsDoc"
import type { DocFunction, XsDoc } from "@/lib/xsDoc"
import { cn } from "@/lib/utils"
// Synced from the bot repo: `npm run docs:sync`
import xsApiEn from "@/content/xs-api.md?raw"
import xsApiTr from "@/content/xs-api.tr.md?raw"

const docs: Record<"tr" | "en", { md: string; yieldLabel: string }> = {
  en: { md: xsApiEn, yieldLabel: "yield" },
  tr: { md: xsApiTr, yieldLabel: "yield" },
}

/** Python scripting API reference (xs module), rendered from Markdown */
export function PythonDocs() {
  const lang = useLang()
  const t = useT()
  const doc: XsDoc = useMemo(() => buildDoc(docs[lang].md, docs[lang].yieldLabel), [lang])
  const [query, setQuery] = useState("")
  const [current, setCurrent] = useState("")
  const bodyRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // "/" focuses the function search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement
      if (e.key === "/" && el?.tagName !== "INPUT" && el?.tagName !== "TEXTAREA") {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Highlight the section being read
  useEffect(() => {
    const onScroll = () => {
      let id = ""
      for (const s of doc.sections) {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top < 140) id = s.id
      }
      setCurrent(id)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [doc])

  // Jump to a deep link (#xs-Kill) once the content is in the page
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [doc])

  // Copy buttons inside the rendered Markdown
  const onBodyClick = (e: MouseEvent<HTMLDivElement>) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-copy]")
    if (!btn) return
    const code = btn.parentElement?.querySelector("code")?.textContent ?? ""
    const done = () => {
      btn.textContent = t("Kopyalandı", "Copied")
      setTimeout(() => (btn.textContent = t("Kopyala", "Copy")), 1200)
    }
    navigator.clipboard?.writeText(code).then(done, () => selectText(btn.parentElement))
  }

  // The Markdown's buttons are written in English; relabel for the language
  useEffect(() => {
    bodyRef.current?.querySelectorAll("[data-copy]").forEach((b) => (b.textContent = t("Kopyala", "Copy")))
  }, [doc, t])

  const q = query.trim().toLowerCase().replace(/^xs\./, "")
  const matches = doc.functions.filter((f) => !q || f.name.toLowerCase().includes(q))

  return (
    <div className="flex gap-8">
      <aside className="sticky top-[121px] hidden max-h-[calc(100vh-137px)] w-[220px] shrink-0 flex-col overflow-y-auto pb-6 lg:flex">
        <SearchBox inputRef={searchRef} value={query} onChange={setQuery} />
        {!q && (
          <>
            <IndexLabel>{t("BÖLÜMLER", "SECTIONS")}</IndexLabel>
            <nav className="flex flex-col">
              {doc.sections
                .filter((s) => !/^(Contents|İçindekiler)$/.test(s.title))
                .map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={cn(
                      "-ml-px border-l py-1 pl-3 text-[13px] transition-colors",
                      current === s.id
                        ? "border-foreground font-medium text-foreground"
                        : "border-border text-neutral-600 hover:text-foreground"
                    )}
                  >
                    {s.title}
                  </a>
                ))}
            </nav>
          </>
        )}
        <IndexLabel>{t("FONKSİYONLAR", "FUNCTIONS")}</IndexLabel>
        <FunctionList functions={matches} query={query} onPick={() => setQuery("")} />
      </aside>

      <div className="min-w-0 flex-1">
        {/* Phones / narrow screens: the index folds above the content */}
        <details className="mb-6 rounded-xl border border-border bg-card lg:hidden">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium">{t("Fonksiyon bul", "Find a function")}</summary>
          <div className="border-t border-border p-4">
            <SearchBox value={query} onChange={setQuery} />
            <div className="mt-3 max-h-72 overflow-y-auto">
              <FunctionList functions={matches} query={query} onPick={() => setQuery("")} />
            </div>
          </div>
        </details>

        <article
          ref={bodyRef}
          onClick={onBodyClick}
          className="xs-doc"
          dangerouslySetInnerHTML={{ __html: doc.html }}
        />
      </div>
    </div>
  )
}

function selectText(el: Element | null | undefined) {
  const code = el?.querySelector("code")
  if (!code) return
  const range = document.createRange()
  range.selectNodeContents(code)
  const sel = window.getSelection()
  sel?.removeAllRanges()
  sel?.addRange(range)
}

function IndexLabel({ children }: { children: React.ReactNode }) {
  return <span className="mb-2 mt-6 text-xs font-medium tracking-wide text-neutral-600">{children}</span>
}

function SearchBox({
  value,
  onChange,
  inputRef,
}: {
  value: string
  onChange: (v: string) => void
  inputRef?: React.Ref<HTMLInputElement>
}) {
  const t = useT()
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("Fonksiyon ara  ( / )", "Find a function  ( / )")}
        aria-label={t("Fonksiyon ara", "Find a function")}
        className="h-9 w-full rounded-md border border-input bg-card pl-8 pr-2 text-sm outline-none placeholder:text-neutral-500 focus-visible:ring-2 focus-visible:ring-ring/40"
      />
    </label>
  )
}

function FunctionList({ functions, query, onPick }: { functions: DocFunction[]; query: string; onPick: () => void }) {
  const t = useT()
  if (!functions.length)
    return <p className="text-sm text-muted-foreground">{t(`"${query}" ile eşleşen fonksiyon yok`, `No function matches "${query}"`)}</p>
  return (
    <ul className="flex flex-col">
      {functions.map((f, i) => {
        // Group title above the first function of each section
        const head = i === 0 || functions[i - 1].group !== f.group ? f.group : null
        return (
          <li key={f.id}>
            {head && <div className="pb-1 pt-3 text-[11px] font-medium uppercase tracking-wide text-neutral-500">{head}</div>}
            <a
              href={`#${f.id}`}
              onClick={onPick}
              className="flex items-center gap-1.5 rounded px-1.5 py-0.5 font-mono text-[12.5px] text-neutral-500 hover:bg-muted"
            >
              <span>
                xs.<span className="text-foreground">{f.name.slice(3)}</span>
              </span>
              {f.yields && <span className="ml-auto text-[10px] font-sans font-medium text-warning">yield</span>}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
