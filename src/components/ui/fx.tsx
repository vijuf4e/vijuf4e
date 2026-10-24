import { fxText, useRates } from "@/lib/fx"
import { cn } from "@/lib/utils"

/** USD/EUR equivalent of a lira price at the previous day's rate, e.g. "(≈ $27 · €24)" */
export function Fx({ price, className }: { price: string; className?: string }) {
  const text = fxText(price, useRates())
  if (!text) return null
  return <span className={cn("whitespace-nowrap text-xs font-normal text-neutral-500", className)}>({text})</span>
}
