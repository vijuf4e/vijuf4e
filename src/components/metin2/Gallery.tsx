import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react"

type Slide = { type: "image"; src: string } | { type: "video"; youtubeId: string }

// Add screenshots to public/metin2/ (or YouTube video IDs) and list them here
const slides: Slide[] = [
  { type: "image", src: "/metin2/running.png" },
  { type: "video", youtubeId: "r5rVcPRuus4" },
]
const images = slides.flatMap((s) => (s.type === "image" ? [s.src] : []))
// Empty slots show a placeholder until real screenshots are added
const placeholderCount = 4

export function Gallery() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const slideCount = Math.max(slides.length, placeholderCount)

  const scrollTo = useCallback((index: number) => {
    const track = trackRef.current
    if (!track) return
    const clamped = Math.max(0, Math.min(slideCount - 1, index))
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" })
  }, [slideCount])

  const onScroll = () => {
    const track = trackRef.current
    if (track) setActive(Math.round(track.scrollLeft / track.clientWidth))
  }

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null)
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i + 1) % images.length))
      if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? i : (i - 1 + images.length) % images.length))
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightbox])

  const arrowClass =
    "absolute top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-border bg-surface/70 backdrop-blur hover:border-gold-line hover:text-primary flex items-center justify-center text-foreground transition-opacity hover:bg-background disabled:opacity-0"

  return (
    <section id="gallery" className="pb-16 px-6 scroll-mt-24">
      <div className="mx-auto max-w-6xl relative glass overflow-hidden">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {Array.from({ length: slideCount }, (_, i) => {
            const slide = slides[i]
            return (
              <div key={i} className="w-full shrink-0 snap-center aspect-[2772/1198] flex items-center justify-center">
                {slide?.type === "image" ? (
                  <img
                    src={slide.src}
                    alt={`Metin2 screenshot ${i + 1}`}
                    className="w-full h-full object-contain cursor-zoom-in"
                    onClick={() => setLightbox(images.indexOf(slide.src))}
                    draggable={false}
                  />
                ) : slide?.type === "video" ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${slide.youtubeId}?rel=0`}
                    title={`Metin2 video ${i + 1}`}
                    className="h-full max-w-full aspect-video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full bg-surface-2 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <ImageIcon className="h-8 w-8" strokeWidth={1.5} />
                    <span className="text-sm">Screenshot {i + 1}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <button
          type="button"
          aria-label="Previous image"
          className={`${arrowClass} left-4`}
          onClick={() => scrollTo(active - 1)}
          disabled={active === 0}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Next image"
          className={`${arrowClass} right-4`}
          onClick={() => scrollTo(active + 1)}
          disabled={active === slideCount - 1}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer"
          onClick={() => setLightbox(null)}
        >
          <img
            src={images[lightbox]}
            alt="Zoomed screenshot"
            className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}
