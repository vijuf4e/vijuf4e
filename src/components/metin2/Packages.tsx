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
  { clients: 6, days: 10, price: "$10", productId: 363748 },
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
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Choose Your Package</h2>

          <div
            role="tablist"
            aria-label="Client count"
            className="flex overflow-x-auto rounded-lg border border-border bg-card p-1 gap-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {clientOptions.map((value) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={value === clients}
                onClick={() => selectClients(value)}
                className={`shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  value === clients
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {value} Clients
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border grid lg:grid-cols-[1fr_340px]">
          <div className="p-7 flex flex-col gap-4">
            <span className="text-sm font-medium text-muted-foreground">Duration</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {durations.map((p) => (
                <button
                  key={p.days}
                  type="button"
                  onClick={() => setDays(p.days)}
                  aria-pressed={p.days === selected.days}
                  className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                    p.days === selected.days
                      ? "border-foreground bg-card"
                      : "border-border hover:border-foreground/40"
                  }`}
                >
                  <div className="text-sm font-semibold text-foreground">{p.days} Days</div>
                  <div className="text-sm text-muted-foreground">{p.price}</div>
                </button>
              ))}
            </div>

            <ul className="mt-2 grid sm:grid-cols-3 gap-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-foreground" />
                Up to {selected.clients} clients at once
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-foreground" />
                {selected.days}-day license
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-foreground" />
                Support on Discord
              </li>
            </ul>
          </div>

          <div className="p-7 flex flex-col justify-between gap-6 border-t lg:border-t-0 lg:border-l border-border bg-card rounded-b-xl lg:rounded-bl-none lg:rounded-r-xl">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">
                {selected.clients} Clients · {selected.days} Days
              </span>
              <span className="text-5xl font-extrabold tracking-tighter text-foreground">{selected.price}</span>
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
