import { useState } from "react"
import { ChevronDown, ChevronRight, GripVertical, Search, ShoppingCart } from "lucide-react"
import { linkTo } from "@/lib/router"
import { products } from "@/lib/products"
import { useLang, useT } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Badge, SectionTitle } from "@/components/ui/panel"
import { PageHeader } from "@/components/layout/PageHeader"

const filters = [
  { value: "all", label: { tr: "Tümü", en: "All" } },
  { value: "green", label: { tr: "Aktif", en: "Active" } },
  { value: "yellow", label: { tr: "Beta", en: "Beta" } },
]

export function Overview({ path }: { path: string }) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState(filters[0].value)
  const t = useT()
  const lang = useLang()

  const q = query.trim().toLocaleLowerCase(lang)
  const shown = products.filter(
    (p) =>
      (filter === "all" || p.status.tone === filter) &&
      `${p.name} ${p.product}`.toLocaleLowerCase(lang).includes(q)
  )

  return (
    <>
      <PageHeader title={t("Genel Bakış", "Overview")} path={path} className="max-w-5xl" />
      <div className="mx-auto w-full max-w-5xl px-4 py-9 sm:px-6">
        <SectionTitle
          title={t("Ürünler", "Products")}
          description={t("Xweardes üzerinden kullanabileceğiniz tüm ürünler.", "All products available on Xweardes.")}
          action={
            <Button variant="muted" asChild>
              <a href="/buy" onClick={linkTo("/buy")}>
                <ShoppingCart />
                {t("Satın Al", "Buy")}
              </a>
            </Button>
          }
        />

        <div className="mb-4 flex gap-3">
          <label className="flex h-9 flex-1 items-center gap-2 rounded-md border border-input bg-card px-3 text-sm focus-within:ring-2 focus-within:ring-ring/30">
            <Search className="h-4 w-4 text-neutral-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("Ürün ara...", "Search products...")}
              className="w-full bg-transparent outline-none placeholder:text-neutral-500"
            />
          </label>
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label={t("Durum filtresi", "Status filter")}
              className="h-9 w-32 appearance-none rounded-md border border-input bg-card pl-3 pr-8 text-sm outline-none focus:ring-2 focus:ring-ring/30 sm:w-36"
            >
              {filters.map((f) => (
                <option key={f.value} value={f.value}>
                  {t(f.label)}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-neutral-500" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {shown.map((p) => (
            <a
              key={p.slug}
              href={`/${p.slug}`}
              onClick={linkTo(`/${p.slug}`)}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-4 transition-colors hover:border-neutral-300 sm:px-6"
            >
              <GripVertical className="hidden h-4 w-4 text-neutral-400 sm:block" />
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                <img src={p.logo} alt="" className={`${p.logoClass} max-h-6 object-contain`} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium">
                    {p.name} {p.product}
                  </span>
                  <Badge tone={p.status.tone}>{t(p.status.label)}</Badge>
                </span>
              </span>
              <span className="hidden text-right sm:block">
                <span className="block text-sm font-semibold">{p.plans[0].price}</span>
                <span className="block text-xs text-muted-foreground">{t(p.plans[0].period)}</span>
              </span>
              <ChevronRight className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-0.5" />
            </a>
          ))}
          {shown.length === 0 && (
            <div className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
              {t("Aramanızla eşleşen ürün bulunamadı.", "No products match your search.")}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
