import { useState } from "react"
import { ChevronRight, CircleCheck, HelpCircle, Wallet } from "lucide-react"
import { linkTo } from "@/lib/router"
import { buyUrl, DISCORD_URL, productBySlug, products } from "@/lib/products"
import type { Plan, Product } from "@/lib/products"
import { useLang, useT } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Badge, Card } from "@/components/ui/panel"
import { Modal } from "@/components/ui/modal"
import { Fx } from "@/components/ui/fx"
import { useRates } from "@/lib/fx"
import { PageHeader } from "@/components/layout/PageHeader"
import { cn } from "@/lib/utils"

export function Buy({ path }: { path: string }) {
  const t = useT()
  const product = productBySlug(path.split("/")[2] ?? "")
  const tabs = [
    { href: "/buy", label: t("Genel Bakış", "Overview") },
    ...products.map((p) => ({ href: `/buy/${p.slug}`, label: p.name })),
  ]

  return (
    <>
      <PageHeader
        title={t("Satın Al", "Buy")}
        path={product ? `/buy/${product.slug}` : "/buy"}
        back="/"
        tabs={tabs}
        className="max-w-[1240px]"
      />
      <div className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6">
        {product ? <Checkout key={product.slug} product={product} /> : <Choose />}
      </div>
    </>
  )
}

function Choose() {
  const t = useT()
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
                <Badge tone={p.status.tone}>{t(p.status.label)}</Badge>
              </span>
              <span className="text-sm text-muted-foreground">{t(p.description)}</span>
            </span>
          </div>
          <div className="mt-6 flex items-end justify-between border-t border-border pt-4">
            <span>
              <span className="text-2xl font-bold">{p.plans[0].price}</span>
              <span className="ml-1 text-xs text-neutral-600">
                {p.plans.length > 1 ? t("'den başlayan", "and up") : t(p.plans[0].period)}
              </span>
              <Fx price={p.plans[0].price} className="ml-1" />
            </span>
            <span className="flex items-center gap-1 text-sm font-medium">
              {t("Devam et", "Continue")}{" "}
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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
  const t = useT()
  const lang = useLang()
  const plan = product.plans[planIndex]
  const isGrid = product.plans.every((p) => p.days && p.clients)
  // Plans with a Game24card product go through the order API (crypto); the rest are sold on Discord
  const method = plan.productId ? t("Kripto (BTC, LTC)", "Crypto (BTC, LTC)") : "Discord"
  const payUrl = plan.productId ? buyUrl(plan.productId, lang) : DISCORD_URL

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_352px]">
      <Card className="flex flex-col gap-7 p-6">
        <div>
          <Label hint={t("Not: Ürün bilgileri sipariş sayfanızda da gösterilir.", "Note: Product details are also shown on your order page.")}>
            {t("Ürün", "Product")}
          </Label>
          <div className="flex h-10 items-center rounded-md border border-input px-3 text-sm">
            {product.name} {product.product}
          </div>
        </div>

        <div>
          <Label>{t("Özellikler", "Features")}</Label>
          <ul className="grid gap-x-6 gap-y-3 pt-1 text-sm text-neutral-700 sm:grid-cols-2">
            {product.features.map((f) => (
              <li key={f.en} className="flex items-center gap-3">
                <CircleCheck className="h-4 w-4 shrink-0 text-success" />
                {t(f)}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Label>{t("Paket", "Package")}</Label>
          {isGrid ? (
            <PackageGrid plans={product.plans} value={planIndex} onChange={setPlanIndex} />
          ) : (
            <div className="flex flex-col gap-3" role="radiogroup">
              {product.plans.map((p, i) => {
                const selected = i === planIndex
                return (
                  <button
                    key={p.label.en}
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
                      <span className="text-sm font-medium">{t(p.label)}</span>
                      <span className="ml-2 text-sm text-success">
                        {p.price}
                        {t(p.period)}
                      </span>
                      <span className="mt-1 block text-sm text-neutral-600">{t(product.description)}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div>
          <Label>{t("Teslimat", "Delivery")}</Label>
          <div className="rounded-lg border border-dashed border-border px-5 py-4 text-sm text-neutral-600">
            {plan.productId
              ? t(
                  "Ödeme onaylandıktan sonra lisans anahtarınız sipariş sayfanızda görüntülenir. Patcher'ı Metin2 sayfasındaki İndir bölümünden indirebilirsiniz.",
                  "Once the payment is confirmed, your license key is shown on your order page. You can download the Patcher from the Download section on the Metin2 page."
                )
              : t(
                  "Satın alma işlemi Discord sunucumuz üzerinden tamamlanır. Ekibimiz lisansınızı Discord üzerinden iletir.",
                  "Purchases are completed on our Discord server. Our team delivers your license on Discord."
                )}
          </div>
        </div>
      </Card>

      <Card className="p-6 lg:sticky lg:top-[125px]">
        <h2 className="border-b border-border pb-5 text-lg font-semibold">{t("Sipariş Özeti", "Order Summary")}</h2>
        <dl className="flex flex-col gap-4 border-b border-border py-6 text-sm font-medium">
          <div className="flex justify-between gap-4">
            <dt>{t("Ürün", "Product")}</dt>
            <dd className="text-right">{product.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>{t("Paket", "Package")}</dt>
            <dd className="text-right">{t(plan.label)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>{t("Ödeme yöntemi", "Payment method")}</dt>
            <dd className="text-right">{method}</dd>
          </div>
        </dl>
        <div className="flex items-center justify-between py-5 text-lg font-semibold">
          <span>{t("Toplam", "Total")}</span>
          <span className="flex items-baseline gap-2">
            {plan.listPrice && <s className="text-sm font-normal text-neutral-400">{plan.listPrice}</s>}
            {plan.price}
          </span>
        </div>
        <Fx price={plan.price} className="-mt-3 mb-4 block text-right" />
        <Button className="w-full" size="lg" onClick={() => setPaying(true)}>
          {t("Satın Al", "Buy")}
        </Button>
      </Card>

      <Modal
        open={paying}
        onClose={() => setPaying(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setPaying(false)}>
              {t("Vazgeç", "Cancel")}
            </Button>
            <Button asChild>
              <a href={payUrl} {...(plan.productId ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
                {t("Ödeme", "Pay")}
              </a>
            </Button>
          </>
        }
      >
        <div className="flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent-line bg-accent-soft text-accent">
            <Wallet className="h-5 w-5" />
          </span>
          <h2 className="mt-4 text-xl font-semibold">{t("Ödemeye geç", "Proceed to payment")}</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            {plan.productId
              ? t(
                  "Sipariş sayfanıza yönlendirileceksiniz. Ödemeyi kripto (BTC, LTC) ile tamamladığınızda lisans anahtarınız aynı sayfada görüntülenir.",
                  "You will be redirected to your order page. Once you pay with crypto (BTC, LTC), your license key appears on the same page."
                )
              : t(
                  "Discord sunucumuza yönlendirileceksiniz. Satın alma işlemini ekibimizle birlikte tamamlayabilirsiniz.",
                  "You will be redirected to our Discord server, where you can complete the purchase with our team."
                )}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <div>
            <span className="mb-2 block text-sm font-medium">{t("Ödeme yöntemi", "Payment method")}</span>
            <div className="flex h-10 items-center rounded-md border border-input px-3 text-sm">{method}</div>
          </div>
          <div>
            <span className="mb-2 block text-sm font-medium">{t("Tutar", "Amount")}</span>
            <div className="flex h-10 items-center justify-between rounded-md border border-input px-3 text-sm">
              <span className="flex items-baseline gap-2">
                {plan.price}
                <Fx price={plan.price} />
              </span>
              <span className="text-xs font-medium text-neutral-600">{plan.price.endsWith("₺") ? "TRY" : "USD"}</span>
            </div>
          </div>
        </div>

        <dl className="mt-6 flex flex-col gap-3 border-t border-border pt-5 text-sm">
          <dt className="text-neutral-600">{t("Sipariş Detayları", "Order Details")}</dt>
          <div className="flex justify-between">
            <dt>{t("Ürün", "Product")}</dt>
            <dd className="font-medium">
              {product.name} {product.product}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>{t("Paket", "Package")}</dt>
            <dd className="font-medium">{t(plan.label)}</dd>
          </div>
        </dl>
      </Modal>
    </div>
  )
}

function Segmented({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: number; label: string }[]
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-neutral-600">{label}</span>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
        role="radiogroup"
        aria-label={label}
      >
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={o.value === value}
            onClick={() => onChange(o.value)}
            className={cn(
              "h-10 rounded-md border text-sm font-medium transition-colors",
              o.value === value ? "border-accent bg-accent-soft text-accent" : "border-border hover:bg-muted/50"
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

const amountOf = (p: Plan) => parseInt(p.price.replace(/\D/g, ""))

/** Duration × client picker; every combination must exist in `plans` */
function PackageGrid({ plans, value, onChange }: { plans: Plan[]; value: number; onChange: (i: number) => void }) {
  const t = useT()
  const current = plans[value]
  const days = [...new Set(plans.map((p) => p.days!))]
  const clients = [...new Set(plans.map((p) => p.clients!))]
  const pick = (d: number, c: number) => onChange(plans.findIndex((p) => p.days === d && p.clients === c))
  const rates = useRates()
  const rateDate = rates?.date.split("-").reverse().join(".")
  const perDay = `${(amountOf(current) / (current.days! * current.clients!)).toLocaleString("tr-TR", { maximumFractionDigits: 2 })}₺`

  return (
    <div className="flex flex-col gap-5">
      <Segmented
        label={t("Süre", "Duration")}
        options={days.map((d) => ({ value: d, label: t(`${d} Gün`, `${d} Days`) }))}
        value={current.days!}
        onChange={(d) => pick(d, current.clients!)}
      />
      <Segmented
        label={t("Client sayısı", "Clients")}
        options={clients.map((c) => ({ value: c, label: String(c) }))}
        value={current.clients!}
        onChange={(c) => pick(current.days!, c)}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-accent bg-accent-soft px-5 py-4">
        <span>
          <span className="flex items-center gap-2 text-sm font-medium">
            {t(current.label)}
            {current.tag && <Badge tone="green">{t(current.tag)}</Badge>}
          </span>
          <span className="mt-1 block text-xs text-neutral-600">
            {t(`Client başına günlük ${perDay}`, `${perDay} per client per day`)}
          </span>
        </span>
        <span className="flex flex-col items-end gap-0.5">
          <span className="flex items-baseline gap-2">
            {current.listPrice && <s className="text-sm text-neutral-400">{current.listPrice}</s>}
            <span className="text-xl font-bold">{current.price}</span>
            {current.discount && <Badge tone="green">%{current.discount}</Badge>}
          </span>
          <Fx price={current.price} />
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-center text-sm">
          <thead>
            <tr className="text-xs text-neutral-600">
              <th className="py-2 text-left font-medium">{t("Süre / Client", "Duration / Clients")}</th>
              {clients.map((c) => (
                <th key={c} className="py-2 font-medium">
                  {c} Client
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((d) => (
              <tr key={d} className="border-t border-border">
                <td className="py-2 text-left text-neutral-600">{t(`${d} Gün`, `${d} Days`)}</td>
                {clients.map((c) => {
                  const p = plans.find((x) => x.days === d && x.clients === c)!
                  const selected = p === current
                  return (
                    <td key={c} className="p-1">
                      <button
                        type="button"
                        onClick={() => pick(d, c)}
                        className={cn(
                          "w-full rounded-md px-2 py-1.5 transition-colors",
                          selected ? "bg-accent text-white" : "hover:bg-muted"
                        )}
                      >
                        <span className="block font-semibold">{p.price}</span>
                        <span className={cn("block text-[11px]", selected ? "text-white/80" : "text-success")}>
                          {p.discount ? `%${p.discount} ${t("indirim", "off")}` : "—"}
                        </span>
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rates && (
        <p className="text-xs text-neutral-500">
          {t(
            `USD ve EUR tutarları bilgi amaçlıdır; ${rateDate} tarihli kur ile hesaplanır. Ödeme TL tutarı üzerinden alınır.`,
            `USD and EUR amounts are for reference, converted at the ${rateDate} rate. Payment is based on the TRY amount.`
          )}
        </p>
      )}
    </div>
  )
}
