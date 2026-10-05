import type { Lang, Text } from "@/lib/i18n"

export const DISCORD_URL = "https://discord.com/invite/Ct8eBkTvyq"

/** Order page on the payment server; it opens in the visitor's language */
export const buyUrl = (productId: number, lang: Lang) =>
  `https://api.xweardes.com/buy?product=${productId}&lang=${lang}`

export interface Plan {
  label: Text
  price: string
  /** Shown next to the price, e.g. "/ay" */
  period: Text
  /** Game24card product ID; plans without one are sold over Discord */
  productId?: number
}

export interface Product {
  slug: "valorant" | "metin2"
  name: string
  product: string
  description: Text
  logo: string
  logoClass: string
  status: { label: Text; tone: "green" | "yellow" }
  features: Text[]
  plans: Plan[]
}

export const products: Product[] = [
  {
    slug: "valorant",
    name: "Valorant",
    product: "Color Trigger Bot",
    description: { tr: "3 hedef renk · spray ve tap modları", en: "3 target colors · spray and tap modes" },
    logo: "/valorant.png",
    logoClass: "h-6",
    status: { label: { tr: "Aktif", en: "Active" }, tone: "green" },
    features: [
      { tr: "3 hedef renk, ayarlanabilir renk aralığı", en: "3 target colors, adjustable color range" },
      { tr: "Spray ve tap modları", en: "Spray and tap modes" },
      { tr: "FOV, pre-delay, tap ve spray hızı ayarı", en: "FOV, pre-delay, tap and spray speed settings" },
      { tr: "Config kaydet, içe aktar, kodla paylaş", en: "Save, import and share configs as codes" },
      { tr: "İstediğin tuşa bağlanabilir tetik", en: "Trigger bindable to any key" },
      { tr: "Discord üzerinden öncelikli destek", en: "Priority support on Discord" },
    ],
    plans: [{ label: { tr: "1 Ay", en: "1 Month" }, price: "$20", period: { tr: "/ay", en: "/month" } }],
  },
  {
    slug: "metin2",
    name: "Metin2",
    product: "Bot",
    description: { tr: "Tek pencerede yan yana 6 client", en: "6 clients side by side in one window" },
    logo: "/metin2.png",
    logoClass: "h-6",
    status: { label: { tr: "Beta", en: "Beta" }, tone: "yellow" },
    features: [
      { tr: "Tek pencerede 6 client", en: "6 clients in one window" },
      { tr: "Her client için seviye, HP ve durum takibi", en: "Level, HP and status tracking per client" },
      { tr: "Client başlat, durdur ve ayarla", en: "Start, stop and configure clients" },
      { tr: "Tek panelden yönetim", en: "Manage everything from one panel" },
      { tr: "Discord üzerinden destek", en: "Support on Discord" },
      { tr: "Hızlı kurulum", en: "Quick setup" },
    ],
    // Prices must match the Game24card panel and the payment server's config.json
    plans: [
      {
        label: { tr: "6 Client · 10 Gün", en: "6 Clients · 10 Days" },
        price: "400₺",
        period: { tr: "/10 gün", en: "/10 days" },
        productId: 363748,
      },
    ],
  },
]

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug)
