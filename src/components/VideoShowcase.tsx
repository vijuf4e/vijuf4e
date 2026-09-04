import { useState } from "react"

export function VideoShowcase() {
  const [lightbox, setLightbox] = useState<string | null>(null)

  return (
    <section id="videos" className="py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          See It In Action
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          Watch our tools perform in real gameplay scenarios.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl overflow-hidden border border-border bg-card">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src="https://streamable.com/e/ob2vuv"
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                allow="autoplay"
              />
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-border bg-card">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src="https://streamable.com/e/6xiorv"
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                allow="autoplay"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="rounded-xl overflow-hidden border border-border bg-card p-2 w-full max-w-3xl">
            <img
              src="/menu-preview.png"
              alt="Xweardes Menu"
              className="rounded-lg w-full h-auto cursor-pointer transition-opacity hover:opacity-80"
              onClick={() => setLightbox("/menu-preview.png")}
            />
          </div>
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt="Zoomed Preview"
            className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}
