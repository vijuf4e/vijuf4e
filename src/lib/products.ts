import metin2Logo from "@/assets/metin2.png"
import type { Lang, Text } from "@/lib/i18n"

export const DISCORD_URL = "https://discord.com/invite/Ct8eBkTvyq"

/** Served by Caddy from C:\downloads on the payment server; replace the file to ship an update */
export const PATCHER_URL = "https://api.xweardes.com/download/Patcher.exe"

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
  /** Package grid (Metin2): duration and client count pick the plan */
  days?: number
  clients?: number
  /** Undiscounted price (base rate × days × clients), shown struck through */
  listPrice?: string
  /** Percent off the list price, rounded */
  discount?: number
  tag?: Text
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

/**
 * Base rate is 400₺ for 10 days · 6 clients; longer and bigger packages get a discount, days more than clients.
 * The last column is the payment server's product ID (keys + config.json crypto.products). New packages use
 * days × 100 + clients; the three older ones keep the IDs their keys were loaded under.
 */
const METIN2_PRICES: [days: number, clients: number, price: number, productId?: number][] = [
  [10, 6, 400, 363748],
  [10, 12, 749, 697123],
  [10, 18, 1099, 1018],
  [10, 24, 1449, 1024],
  [10, 30, 1799, 1030],
  [20, 6, 699, 2006],
  [20, 12, 1349, 2012],
  [20, 18, 1949, 2018],
  [20, 24, 2549, 2024],
  [20, 30, 3149, 2030],
  [30, 6, 949, 3006],
  [30, 12, 1849, 3012],
  [30, 18, 2699, 3018],
  [30, 24, 3499, 3024],
  [30, 30, 4299, 488161],
]

const METIN2_TAGS: Record<string, Text> = {
  "20x12": { tr: "En Popüler", en: "Most Popular" },
  "30x30": { tr: "En Avantajlı", en: "Best Value" },
}

const tl = (n: number) => `${n.toLocaleString("tr-TR")}₺`

function metin2Plans(): Plan[] {
  return METIN2_PRICES.map(([days, clients, price, productId]) => {
    const list = (400 / 60) * days * clients
    return {
      label: { tr: `${clients} Client · ${days} Gün`, en: `${clients} Clients · ${days} Days` },
      price: tl(price),
      period: { tr: `/${days} gün`, en: `/${days} days` },
      productId,
      days,
      clients,
      listPrice: price < list ? tl(Math.round(list)) : undefined,
      discount: price < list ? Math.round((1 - price / list) * 100) : undefined,
      tag: METIN2_TAGS[`${days}x${clients}`],
    }
  })
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
    description: { tr: "6 ile 30 arası client · 10, 20 veya 30 gün", en: "6 to 30 clients · 10, 20 or 30 days" },
    logo: metin2Logo,
    logoClass: "h-6",
    status: { label: { tr: "Aktif", en: "Active" }, tone: "green" },
    features: [
      { tr: "6, 12, 18, 24 veya 30 client", en: "6, 12, 18, 24 or 30 clients" },
      { tr: "Her client için seviye, HP ve durum takibi", en: "Level, HP and status tracking per client" },
      { tr: "Client başlat, durdur ve ayarla", en: "Start, stop and configure clients" },
      { tr: "Tek panelden yönetim", en: "Manage everything from one panel" },
      { tr: "Discord üzerinden destek", en: "Support on Discord" },
      { tr: "Hızlı kurulum", en: "Quick setup" },
    ],
    // Prices must match the payment server's config.json crypto.products
    plans: metin2Plans(),
  },
]

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug)
