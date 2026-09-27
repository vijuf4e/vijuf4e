import { Keyboard, MessageCircle, Palette, SlidersHorizontal, Timer, Zap } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

const features: Feature[] = [
  { icon: Palette, title: "Multi-Color Detection", description: "Up to 3 target colors with adjustable color range." },
  { icon: Zap, title: "Spray & Tap Modes", description: "Switch firing style anytime, even while moving." },
  { icon: Timer, title: "Precision Timing", description: "FOV, pre-delay, tap and spray speed sliders." },
  { icon: SlidersHorizontal, title: "Config Manager", description: "Save, import and share setups as codes." },
  { icon: Keyboard, title: "Custom Hotkey", description: "Bind the trigger to any key you like." },
  { icon: MessageCircle, title: "Priority Support", description: "Direct help from the team on Discord." },
]

export function Features() {
  return (
    <section id="features" className="pb-16 px-6 scroll-mt-24">
      <div className="mx-auto max-w-6xl grid sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-xl overflow-hidden border border-border bg-border">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="bg-background p-7 flex flex-col gap-3.5">
            <Icon className="h-6 w-6 text-foreground" strokeWidth={1.8} />
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
