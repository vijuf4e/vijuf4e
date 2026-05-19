import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="pt-32 pb-16 px-6">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground">
          Level Up Your Game
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Premium tools designed to give you the competitive edge. Fast, reliable, and undetected.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <a href="#pricing">Get Started</a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#videos">Watch Demo</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
