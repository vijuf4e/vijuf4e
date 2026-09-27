import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Pricing() {
  const [lightbox, setLightbox] = useState(false)

  return (
    <section id="pricing" className="pb-20 px-6 scroll-mt-24">
      <div className="mx-auto max-w-6xl flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 w-full flex justify-center">
          {/* Shown at its native 704px width so the UI text isn't resampled */}
          <img
            src="/menu-preview.png"
            alt="Xweardes Menu"
            width={704}
            height={761}
            className="rounded-lg w-auto max-w-full h-auto cursor-zoom-in"
            onClick={() => setLightbox(true)}
          />
        </div>

        <div className="w-full lg:w-[340px] shrink-0 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">1 Month</h3>
            <Badge>Popular</Badge>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-6xl font-extrabold tracking-tighter text-foreground">$20</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            One simple plan with full access to all of our tools.
          </p>
          <Button className="w-full" size="lg" asChild>
            <a href="https://discord.com/invite/Ct8eBkTvyq" target="_blank" rel="noopener noreferrer">
              Buy Now
            </a>
          </Button>
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer"
          onClick={() => setLightbox(false)}
        >
          <img
            src="/menu-preview.png"
            alt="Zoomed Preview"
            className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}
