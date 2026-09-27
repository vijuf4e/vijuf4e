const videos = [
  "https://streamable.com/e/ob2vuv",
  "https://streamable.com/e/6xiorv",
]

export function VideoShowcase() {
  return (
    <section id="videos" className="pb-16 px-6 scroll-mt-24">
      <div className="mx-auto max-w-[1440px] grid md:grid-cols-2 gap-6">
        {videos.map((src) => (
          <div key={src} className="rounded-xl overflow-hidden border border-border bg-card">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={src}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                allow="autoplay"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
