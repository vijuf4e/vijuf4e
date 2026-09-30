import { Gallery } from "@/components/metin2/Gallery"
import { Packages } from "@/components/metin2/Packages"

export function Metin2() {
  return (
    <>
      <section className="pt-28 pb-8 px-6">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-muted-foreground">Xweardes / Metin2</span>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-none text-foreground">
              Run More Clients
            </h1>
          </div>
          <p className="text-base text-muted-foreground max-w-sm leading-relaxed">
            Scale up with multi-client packages. Pick the plan that fits you and get started in minutes.
          </p>
        </div>
      </section>
      <Gallery />
      <Packages />
    </>
  )
}
