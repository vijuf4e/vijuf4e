import { Check, Minus } from "lucide-react"
import { linkTo } from "@/lib/router"
import { products } from "@/lib/products"
import { useT } from "@/lib/i18n"
import type { Text } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/panel"
import { PageHeader } from "@/components/layout/PageHeader"

type Cell = Text | string | boolean

// One value per product, in the same order as `products` (Valorant, Metin2)
const groups: { title: Text; rows: { label: Text; values: Cell[] }[] }[] = [
  {
    title: { tr: "Paket Detayları", en: "Package Details" },
    rows: [
      { label: { tr: "Oyun", en: "Game" }, values: ["Valorant", "Metin2"] },
      { label: { tr: "Ürün", en: "Product" }, values: ["Color Trigger Bot", "Bot"] },
      { label: { tr: "Süre", en: "Duration" }, values: [{ tr: "1 ay", en: "1 month" }, { tr: "10 gün", en: "10 days" }] },
      { label: { tr: "Client sayısı", en: "Clients" }, values: ["—", "6"] },
      { label: { tr: "Ödeme", en: "Payment" }, values: ["Discord", { tr: "Kripto", en: "Crypto" }] },
    ],
  },
  {
    title: { tr: "Özellikler", en: "Features" },
    rows: [
      { label: { tr: "Çoklu renk algılama", en: "Multi-color detection" }, values: [true, false] },
      { label: { tr: "Spray ve tap modları", en: "Spray and tap modes" }, values: [true, false] },
      { label: { tr: "Config paylaşımı", en: "Config sharing" }, values: [true, false] },
      { label: { tr: "Tek pencerede çoklu client", en: "Multiple clients in one window" }, values: [false, true] },
      { label: { tr: "Client durum takibi", en: "Client status tracking" }, values: [false, true] },
      { label: { tr: "Discord desteği", en: "Discord support" }, values: [true, true] },
    ],
  },
]

function Value({ value }: { value: Cell }) {
  const t = useT()
  if (value === true) return <Check className="mx-auto h-4 w-4" />
  if (value === false) return <Minus className="mx-auto h-4 w-4 text-neutral-300" />
  return <span>{typeof value === "string" ? value : t(value)}</span>
}

export function Pricing({ path }: { path: string }) {
  const t = useT()
  return (
    <>
      <PageHeader title={t("Fiyatlandırma", "Pricing")} path={path} className="max-w-5xl" />
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <div className="min-w-[640px]">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="text-xl font-semibold tracking-tight">
                {t("İhtiyacınıza Uygun Paketi Seçin", "Choose the Right Package")}
              </h2>
            </div>

            <div className="grid grid-cols-[1.2fr_1fr_1fr]">
              <div className="flex items-center border-r border-border px-6 text-sm text-neutral-600">
                {t("Paketler", "Packages")}
              </div>
              {products.map((p) => {
                const plan = p.plans[0]
                return (
                  <div key={p.slug} className="border-r border-border p-3 last:border-r-0">
                    <div className="flex h-full flex-col rounded-xl border border-border p-5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2 text-sm font-semibold">
                          <img src={p.logo} alt="" className="h-5 w-7 object-contain" />
                          {p.name}
                        </span>
                        <Badge tone={p.status.tone}>{t(p.status.label)}</Badge>
                      </div>
                      <span className="mt-4 text-[11px] font-medium uppercase tracking-wide text-neutral-600">
                        {t(plan.label)}
                      </span>
                      <span className="mb-4 flex items-baseline gap-1">
                        <span className="text-2xl font-bold">{plan.price}</span>
                        <span className="text-xs text-neutral-600">{t(plan.period)}</span>
                      </span>
                      <Button size="sm" className="mt-auto w-full" asChild>
                        <a href={`/buy/${p.slug}`} onClick={linkTo(`/buy/${p.slug}`)}>
                          {t("Satın Al", "Buy")}
                        </a>
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            {groups.map((group) => (
              <div key={group.title.en}>
                <div className="grid grid-cols-[1.2fr_2fr] border-t border-border">
                  <div className="border-r border-border px-6 py-3.5 text-sm font-semibold">{t(group.title)}</div>
                  <div />
                </div>
                {group.rows.map((row) => (
                  <div key={row.label.en} className="grid grid-cols-[1.2fr_1fr_1fr] border-t border-border text-sm">
                    <div className="border-r border-border px-6 py-3">{t(row.label)}</div>
                    {row.values.map((v, i) => (
                      <div key={i} className="border-r border-border px-4 py-3 text-center last:border-r-0">
                        <Value value={v} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
