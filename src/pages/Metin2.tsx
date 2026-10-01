import { Gallery } from "@/components/metin2/Gallery"
import { Packages } from "@/components/metin2/Packages"

export function Metin2() {
  return (
    <>
      <section className="pt-28 pb-8 px-6">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-none text-foreground">
            [BETA]
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed lg:whitespace-nowrap">
            Scale up with multi-client packages. Pick the plan that fits you and get started in minutes.
          </p>
        </div>
      </section>
      <Gallery />
      <Packages />
    </>
  )
}
