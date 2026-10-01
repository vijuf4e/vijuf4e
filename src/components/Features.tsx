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
    <section id="features" className="pt-8 pb-20 px-6 scroll-mt-24">
      <div className="mx-auto max-w-6xl flex flex-col gap-3 mb-8">
        <span className="section-label">Features</span>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          Built different. <span className="text-primary">Built by players.</span>
        </h2>
      </div>
      <div className="mx-auto max-w-6xl grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="glass glass-hover p-7 flex flex-col gap-2">
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-gold-line bg-gold-dim text-primary">
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </span>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
