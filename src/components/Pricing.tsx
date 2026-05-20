import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

interface PricingTier {
  duration: string
  originalPrice: string
  price: string
  discount: string
  features: string[]
  popular?: boolean
  note: string
}

const tiers: PricingTier[] = [
  {
    duration: "1 Week",
    originalPrice: "",
    price: "$10",
    discount: "",
    features: [
      "All core features",
      "Priority support",
      "Advanced config presets",
      "Multi color based",
    ],
    note: "",
  },
  {
    duration: "1 Month",
    originalPrice: "$40",
    price: "$30",
    discount: "-25% OFF",
    features: [
      "All core features",
      "Priority support",
      "Advanced config presets",
      "Multi color based",
    ],
    popular: true,
    note: "",
  },
]

function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <div
      className={`relative rounded-2xl border bg-card p-6 flex flex-col h-full ${
        tier.popular
          ? "border-foreground/30 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
          : "border-border"
      }`}
    >
      {tier.discount && (
        <Badge className="absolute -top-3 right-4">
          {tier.discount}
        </Badge>
      )}

      <div className="text-center mb-6">
        <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          {tier.duration}
        </h3>
        <div className="flex items-center justify-center gap-2">
          {tier.originalPrice && (
            <span className="text-muted-foreground line-through text-sm">
              {tier.originalPrice}
            </span>
          )}
          <span className="text-2xl font-bold text-foreground">
            {tier.price}
          </span>
        </div>
      </div>

      <div className="border-t border-border my-2" />

      <ul className="space-y-3 my-6 flex-1">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check className="h-5 w-5 text-foreground shrink-0 mt-0.5" />
            <span className="text-sm text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <Button className="w-full" size="lg" asChild>
        <a href="https://discord.com/invite/DZMMTwWbs2" target="_blank" rel="noopener noreferrer">
          Buy Now
        </a>
      </Button>
      {tier.note && (
        <p className="text-center text-xs text-muted-foreground mt-3">{tier.note}</p>
      )}
    </div>
  )
}

export function Pricing() {
  return (
    <section id="pricing" className="py-20 px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          Our Pricing
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          Choose the plan that fits your needs. All plans include full access to our tools.
        </p>

        <div className="grid md:grid-cols-2 gap-6 items-stretch max-w-3xl mx-auto">
          {tiers.map((tier) => (
            <PricingCard key={tier.duration} tier={tier} />
          ))}
        </div>

      </div>
    </section>
  )
}
