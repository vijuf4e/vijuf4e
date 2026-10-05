import { useState } from "react"
import { ChevronRight, CircleCheck, HelpCircle, Wallet } from "lucide-react"
import { linkTo } from "@/lib/router"
import { BUY_URL, DISCORD_URL, productBySlug, products } from "@/lib/products"
import type { Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Badge, Card } from "@/components/ui/panel"
import { Modal } from "@/components/ui/modal"
import { PageHeader } from "@/components/layout/PageHeader"
import { cn } from "@/lib/utils"

const tabs = [
  { href: "/buy", label: "Genel Bakış" },
  ...products.map((p) => ({ href: `/buy/${p.slug}`, label: p.name })),
]

export function Buy({ path }: { path: string }) {
  const product = productBySlug(path.split("/")[2] ?? "")

  return (
    <>
      <PageHeader title="Satın Al" path={product ? `/buy/${product.slug}` : "/buy"} back="/" tabs={tabs} className="max-w-[1240px]" />
      <div className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6">
        {product ? <Checkout key={product.slug} product={product} /> : <Choose />}
      </div>
    </>
  )
}

function Choose() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {products.map((p) => (
        <a
          key={p.slug}
          href={`/buy/${p.slug}`}
          onClick={linkTo(`/buy/${p.slug}`)}
          className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-neutral-300"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <img src={p.logo} alt="" className={`${p.logoClass} max-h-7 max-w-8 object-contain`} />
            </span>
            <span className="flex-1">
              <span className="flex items-center gap-2 font-semibold">
                {p.name} {p.product}
                <Badge tone={p.status.tone}>{p.status.label}</Badge>
              </span>
              <span className="text-sm text-muted-foreground">{p.description}</span>
            </span>
          </div>
          <div className="mt-6 flex items-end justify-between border-t border-border pt-4">
            <span>
              <span className="text-2xl font-bold">{p.plans[0].price}</span>
              <span className="ml-1 text-xs text-neutral-600">{p.plans[0].period}</span>
            </span>
            <span className="flex items-center gap-1 text-sm font-medium">
              Devam et <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </a>
      ))}
    </div>
  )
}

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-2">
      <h3 className="flex items-center gap-2 text-[15px] font-medium">
        {children}
        <HelpCircle className="h-4 w-4 text-neutral-400" />
      </h3>
      {hint && <p className="mt-1 text-xs text-neutral-600">{hint}</p>}
    </div>
  )
}

function Checkout({ product }: { product: Product }) {
  const [planIndex, setPlanIndex] = useState(0)
  const [paying, setPaying] = useState(false)
  const plan = product.plans[planIndex]
  // Plans with a Game24card product go through the order API; the rest are sold on Discord
  const method = plan.productId ? "Game24card" : "Discord"
  const payUrl = plan.productId ? BUY_URL + plan.productId : DISCORD_URL

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_352px]">
      <Card className="flex flex-col gap-7 p-6">
        <div>
          <Label hint="Not: Ürün bilgileri sipariş sayfanızda da gösterilir.">Ürün</Label>
          <div className="flex h-10 items-center rounded-md border border-input px-3 text-sm">
            {product.name} {product.product}
          </div>
        </div>

        <div>
          <Label>Özellikler</Label>
          <ul className="grid gap-x-6 gap-y-3 pt-1 text-sm text-neutral-700 sm:grid-cols-2">
            {product.features.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <CircleCheck className="h-4 w-4 shrink-0 text-success" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Label>Paket</Label>
          <div className="flex flex-col gap-3" role="radiogroup">
            {product.plans.map((p, i) => {
              const selected = i === planIndex
              return (
                <button
                  key={p.label}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setPlanIndex(i)}
                  className={cn(
                    "flex items-start gap-4 rounded-lg border px-5 py-4 text-left transition-colors",
                    selected ? "border-accent bg-accent-soft" : "border-border hover:bg-muted/50"
                  )}
                >
                  <span
                    className={cn(
                      "mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                      selected ? "border-accent" : "border-neutral-300"
                    )}
                  >
                    {selected && <span className="h-2 w-2 rounded-full bg-accent" />}
                  </span>
                  <span>
                    <span className="text-sm font-medium">{p.label}</span>
                    <span className="ml-2 text-sm text-success">
                      {p.price}
                      {p.period}
                    </span>
                    <span className="mt-1 block text-sm text-neutral-600">{product.description}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <Label>Teslimat</Label>
          <div className="rounded-lg border border-dashed border-border px-5 py-4 text-sm text-neutral-600">
            {plan.productId
              ? "Ödeme onaylandıktan sonra lisans anahtarınız sipariş sayfanızda görüntülenir. Programı Discord sunucumuzdan indirebilirsiniz."
              : "Satın alma işlemi Discord sunucumuz üzerinden tamamlanır. Ekibimiz lisansınızı Discord üzerinden iletir."}
          </div>
        </div>
      </Card>

      <Card className="p-6 lg:sticky lg:top-[125px]">
        <h2 className="border-b border-border pb-5 text-lg font-semibold">Sipariş Özeti</h2>
        <dl className="flex flex-col gap-4 border-b border-border py-6 text-sm font-medium">
          <div className="flex justify-between gap-4">
            <dt>Ürün</dt>
            <dd className="text-right">{product.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Paket</dt>
            <dd className="text-right">{plan.label}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Ödeme yöntemi</dt>
            <dd className="text-right">{method}</dd>
          </div>
        </dl>
        <div className="flex items-center justify-between py-5 text-lg font-semibold">
          <span>Toplam</span>
          <span>{plan.price}</span>
        </div>
        <Button className="w-full" size="lg" onClick={() => setPaying(true)}>
          Satın Al
        </Button>
      </Card>

      <Modal
        open={paying}
        onClose={() => setPaying(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setPaying(false)}>
              Vazgeç
            </Button>
            <Button asChild>
              <a href={payUrl} {...(plan.productId ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
                Ödeme
              </a>
            </Button>
          </>
        }
      >
        <div className="flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent-line bg-accent-soft text-accent">
            <Wallet className="h-5 w-5" />
          </span>
          <h2 className="mt-4 text-xl font-semibold">Ödemeye geç</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            {plan.productId
              ? "Sipariş sayfanıza yönlendirileceksiniz. Ödemeyi Game24card PIN ile tamamladığınızda lisans anahtarınız aynı sayfada görüntülenir."
              : "Discord sunucumuza yönlendirileceksiniz. Satın alma işlemini ekibimizle birlikte tamamlayabilirsiniz."}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <div>
            <span className="mb-2 block text-sm font-medium">Ödeme yöntemi</span>
            <div className="flex h-10 items-center rounded-md border border-input px-3 text-sm">{method}</div>
          </div>
          <div>
            <span className="mb-2 block text-sm font-medium">Tutar</span>
            <div className="flex h-10 items-center justify-between rounded-md border border-input px-3 text-sm">
              {plan.price}
              <span className="text-xs font-medium text-neutral-600">{plan.price.endsWith("₺") ? "TRY" : "USD"}</span>
            </div>
          </div>
        </div>

        <dl className="mt-6 flex flex-col gap-3 border-t border-border pt-5 text-sm">
          <dt className="text-neutral-600">Sipariş Detayları</dt>
          <div className="flex justify-between">
            <dt>Ürün</dt>
            <dd className="font-medium">
              {product.name} {product.product}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>Paket</dt>
            <dd className="font-medium">{plan.label}</dd>
          </div>
        </dl>
      </Modal>
    </div>
  )
}
