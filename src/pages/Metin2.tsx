import { Button } from "@/components/ui/button"
import { Ticker } from "@/components/Ticker"
import { ClientPanel } from "@/components/metin2/ClientPanel"
import { Gallery } from "@/components/metin2/Gallery"
import { Packages } from "@/components/metin2/Packages"

export function Metin2() {
  return (
    <>
      <section className="px-6 pt-36 pb-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col">
            <span className="section-label mb-4">Metin2 · Multi-Client · Beta</span>
            <h1 className="text-5xl font-extrabold leading-[1.04] tracking-tight text-foreground md:text-6xl text-balance">
              Six clients.
              <br />
              <span className="text-primary">One window.</span>
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Watch level, HP and status for every client side by side. Start, stop and configure each one from a single panel.
            </p>
            <p className="slogan mt-6">// clients 6/6 · build v1.0.0 //</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <a href="#pricing">Buy now · 400₺</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#gallery">See gallery</a>
              </Button>
            </div>
          </div>
          <ClientPanel />
        </div>
      </section>
      <Ticker />
      <div className="pt-16" />
      <Gallery />
      <Packages />
    </>
  )
}
