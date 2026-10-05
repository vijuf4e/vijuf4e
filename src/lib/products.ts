export const DISCORD_URL = "https://discord.com/invite/Ct8eBkTvyq"
export const BUY_URL = "https://api.xweardes.com/buy?product="

export interface Plan {
  label: string
  price: string
  /** Shown next to the price, e.g. "/ay" */
  period: string
  /** Game24card product ID; plans without one are sold over Discord */
  productId?: number
}

export interface Product {
  slug: "valorant" | "metin2"
  name: string
  product: string
  description: string
  logo: string
  logoClass: string
  status: { label: string; tone: "green" | "yellow" }
  features: string[]
  plans: Plan[]
}

export const products: Product[] = [
  {
    slug: "valorant",
    name: "Valorant",
    product: "Color Trigger Bot",
    description: "3 hedef renk · spray ve tap modları",
    logo: "/valorant.png",
    logoClass: "h-6",
    status: { label: "Aktif", tone: "green" },
    features: [
      "3 hedef renk, ayarlanabilir renk aralığı",
      "Spray ve tap modları",
      "FOV, pre-delay, tap ve spray hızı ayarı",
      "Config kaydet, içe aktar, kodla paylaş",
      "İstediğin tuşa bağlanabilir tetik",
      "Discord üzerinden öncelikli destek",
    ],
    plans: [{ label: "1 Ay", price: "$20", period: "/ay" }],
  },
  {
    slug: "metin2",
    name: "Metin2",
    product: "Bot",
    description: "Tek pencerede yan yana 6 client",
    logo: "/metin2.png",
    logoClass: "w-9",
    status: { label: "Beta", tone: "yellow" },
    features: [
      "Tek pencerede 6 client",
      "Her client için seviye, HP ve durum takibi",
      "Client başlat, durdur ve ayarla",
      "Tek panelden yönetim",
      "Discord üzerinden destek",
      "Hızlı kurulum",
    ],
    // Prices must match the Game24card panel
    plans: [{ label: "6 Client · 10 Gün", price: "400₺", period: "/10 gün", productId: 363748 }],
  },
]

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug)
