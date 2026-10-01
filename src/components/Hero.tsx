import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="pt-36 pb-14 px-6">
      <div className="mx-auto max-w-6xl flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        <div className="flex flex-col">
          <span className="section-label mb-4">Valorant · Color Trigger</span>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.04] text-foreground text-balance">
            Every value,
            <br />
            <span className="text-primary">yours to tune.</span>
          </h1>
        </div>
        <div className="flex flex-col gap-5 max-w-md">
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            Up to three target colors, spray and tap modes, and precision timing sliders. Save your setup and share it as a code.
          </p>
          <p className="slogan">// fov 4 · color range 70 · tap speed 10 //</p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <a href="#pricing">Buy now · $20/mo</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#videos">Watch showcase</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
