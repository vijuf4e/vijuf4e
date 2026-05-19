export function VideoShowcase() {
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
          <div className="rounded-xl overflow-hidden border border-border bg-card p-2">
            <img
              src="/product-preview.png"
              alt="Product Preview"
              className="rounded-lg"
              style={{ imageRendering: "auto", width: "auto", height: "auto" }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
