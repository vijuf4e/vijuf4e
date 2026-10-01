import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Package {
  clients: number
  days: number
  price: string
  productId: number // Game24card product ID
}

const BUY_URL = "https://api.xweardes.com/buy?product="

// Prices must match the Game24card panel. Add new packages here; tabs and durations are built from this list
const packages: Package[] = [
  { clients: 6, days: 10, price: "400₺", productId: 363748 },
]

const clientOptions = [...new Set(packages.map((p) => p.clients))].sort((a, b) => a - b)

export function Packages() {
  const [clients, setClients] = useState(clientOptions[0])
  const durations = packages.filter((p) => p.clients === clients).sort((a, b) => a.days - b.days)
  const [days, setDays] = useState(durations[0].days)
  const selected = durations.find((p) => p.days === days) ?? durations[0]

  const selectClients = (value: number) => {
    setClients(value)
    setDays(Math.min(...packages.filter((p) => p.clients === value).map((p) => p.days)))
  }

  return (
    <section id="pricing" className="pb-20 px-6 scroll-mt-24">
      <div className="mx-auto max-w-6xl flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex flex-col gap-3">
            <span className="section-label">Packages</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
              Pick a plan, <span className="text-primary">start in minutes.</span>
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Client count"
            className="flex overflow-x-auto rounded-full border border-border bg-glass p-1 gap-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {clientOptions.map((value) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={value === clients}
                onClick={() => selectClients(value)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                  value === clients
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {value} Clients
              </button>
            ))}
          </div>
        </div>

        <div className="glass glass-lit grid lg:grid-cols-[1fr_340px] shadow-[0_0_0_1px_var(--gold-dim),0_20px_60px_-20px_var(--gold-glow)]">
          <div className="p-7 flex flex-col gap-4">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-subtle">Duration</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {durations.map((p) => (
                <button
                  key={p.days}
                  type="button"
                  onClick={() => setDays(p.days)}
                  aria-pressed={p.days === selected.days}
                  className={`rounded-[10px] border px-4 py-3 text-left transition-colors ${
                    p.days === selected.days
                      ? "border-gold-line bg-gold-dim"
                      : "border-border hover:border-gold-line"
                  }`}
                >
                  <div className="text-sm font-semibold text-foreground">{p.days} Days</div>
                  <div className="font-mono text-sm text-primary">{p.price}</div>
                </button>
              ))}
            </div>

            <ul className="mt-2 grid sm:grid-cols-3 gap-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-success" />
                Up to {selected.clients} clients at once
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-success" />
                {selected.days}-day license
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-success" />
                Support on Discord
              </li>
            </ul>
          </div>

          <div className="p-7 flex flex-col justify-between gap-6 border-t lg:border-t-0 lg:border-l border-border bg-white/[0.02]">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">
                {selected.clients} Clients · {selected.days} Days
              </span>
              <span className="font-mono text-5xl font-bold tracking-tight text-foreground">{selected.price}</span>
            </div>
            <Button className="w-full" size="lg" asChild>
              <a href={BUY_URL + selected.productId}>Buy Now</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
