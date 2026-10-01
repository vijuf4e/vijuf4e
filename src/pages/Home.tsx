import { ArrowRight } from "lucide-react"
import { linkTo } from "@/lib/router"
import { Button } from "@/components/ui/button"
import { Tag } from "@/components/ui/tag"
import { Ticker } from "@/components/Ticker"

const games = [
  {
    name: "Valorant",
    product: "Color Trigger",
    description: "3 target colors · spray & tap modes",
    href: "/valorant",
    logo: "/valorant.png",
    logoClass: "h-7",
    status: { label: "Available", tone: "green" as const },
    price: "$20",
    period: "per month",
  },
  {
    name: "Metin2",
    product: "Multi-Client",
    description: "6 clients side by side in one window",
    href: "/metin2",
    logo: "/metin2.png",
    logoClass: "w-11",
    status: { label: "Beta", tone: "yellow" as const },
    price: "400₺",
    period: "10 days",
  },
]

export function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="flex flex-1 items-center px-6 pt-36 pb-20">
        <div className="mx-auto w-full grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col">
            <span className="section-label mb-4">Built by players</span>
            <h1 className="text-5xl font-extrabold leading-[1.04] tracking-tight text-foreground md:text-6xl text-balance">
              We tune it.
              <br />
              <span className="text-primary">You play it.</span>
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Color trigger for Valorant and multi-client control for Metin2. Set it up in minutes, then tune every value to your style.
            </p>
            <p className="slogan mt-6">// built by players // tuned for players //</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <a href="/metin2" onClick={linkTo("/metin2")}>
                  Metin2 · 400₺ <ArrowRight />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/valorant" onClick={linkTo("/valorant")}>
                  Valorant · $20
                </a>
              </Button>
            </div>
          </div>

          <div className="glass glass-lit flex flex-col gap-1.5 p-1.5">
            <div className="flex items-center justify-between px-3.5 pt-3 pb-2 font-mono text-[11px] font-bold tracking-wider text-subtle">
              <span>// PRODUCTS</span>
              <span>v1.0.0</span>
            </div>
            {games.map((game) => (
              <a
                key={game.name}
                href={game.href}
                onClick={linkTo(game.href)}
                className="group grid grid-cols-[48px_1fr_auto] items-center gap-4 rounded-[10px] border border-border bg-white/[0.02] p-4 transition-colors hover:border-gold-line hover:bg-gold-dim"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-border bg-surface-2">
                  <img src={game.logo} alt="" className={`${game.logoClass} object-contain`} />
                </span>
                <span className="min-w-0">
                  <span className="block font-bold text-foreground">
                    {game.name} · {game.product}
                  </span>
                  <span className="block truncate font-mono text-xs text-muted-foreground">{game.description}</span>
                </span>
                <span className="flex flex-col items-end gap-1.5">
                  <Tag tone={game.status.tone} dot>
                    {game.status.label}
                  </Tag>
                  <span className="font-mono text-base font-bold text-foreground">
                    {game.price} <span className="text-[10px] font-medium text-subtle">{game.period}</span>
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
      <Ticker />
    </div>
  )
}
