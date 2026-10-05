import { Check, Minus } from "lucide-react"
import { linkTo } from "@/lib/router"
import { products } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/panel"
import { PageHeader } from "@/components/layout/PageHeader"

type Cell = string | boolean

// One value per product, in the same order as `products` (Valorant, Metin2)
const groups: { title: string; rows: { label: string; values: Cell[] }[] }[] = [
  {
    title: "Paket Detayları",
    rows: [
      { label: "Oyun", values: ["Valorant", "Metin2"] },
      { label: "Ürün", values: ["Color Trigger Bot", "Bot"] },
      { label: "Süre", values: ["1 ay", "10 gün"] },
      { label: "Client sayısı", values: ["—", "6"] },
      { label: "Ödeme", values: ["Discord", "Game24card"] },
    ],
  },
  {
    title: "Özellikler",
    rows: [
      { label: "Çoklu renk algılama", values: [true, false] },
      { label: "Spray ve tap modları", values: [true, false] },
      { label: "Config paylaşımı", values: [true, false] },
      { label: "Tek pencerede çoklu client", values: [false, true] },
      { label: "Client durum takibi", values: [false, true] },
      { label: "Discord desteği", values: [true, true] },
    ],
  },
]

function Value({ value }: { value: Cell }) {
  if (value === true) return <Check className="mx-auto h-4 w-4" />
  if (value === false) return <Minus className="mx-auto h-4 w-4 text-neutral-300" />
  return <span>{value}</span>
}

export function Pricing({ path }: { path: string }) {
  return (
    <>
      <PageHeader title="Fiyatlandırma" path={path} className="max-w-5xl" />
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <div className="min-w-[640px]">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="text-xl font-semibold tracking-tight">İhtiyacınıza Uygun Paketi Seçin</h2>
            </div>

            <div className="grid grid-cols-[1.2fr_1fr_1fr]">
              <div className="flex items-center border-r border-border px-6 text-sm text-neutral-600">Paketler</div>
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
                        <Badge tone={p.status.tone}>{p.status.label}</Badge>
                      </div>
                      <span className="mt-4 text-[11px] font-medium uppercase tracking-wide text-neutral-600">
                        {plan.label}
                      </span>
                      <span className="mb-4 flex items-baseline gap-1">
                        <span className="text-2xl font-bold">{plan.price}</span>
                        <span className="text-xs text-neutral-600">{plan.period}</span>
                      </span>
                      <Button size="sm" className="mt-auto w-full" asChild>
                        <a href={`/buy/${p.slug}`} onClick={linkTo(`/buy/${p.slug}`)}>
                          Satın Al
                        </a>
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            {groups.map((group) => (
              <div key={group.title}>
                <div className="grid grid-cols-[1.2fr_2fr] border-t border-border">
                  <div className="border-r border-border px-6 py-3.5 text-sm font-semibold">{group.title}</div>
                  <div />
                </div>
                {group.rows.map((row) => (
                  <div key={row.label} className="grid grid-cols-[1.2fr_1fr_1fr] border-t border-border text-sm">
                    <div className="border-r border-border px-6 py-3">{row.label}</div>
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
