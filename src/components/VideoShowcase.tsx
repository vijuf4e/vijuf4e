const videos = [
  "https://streamable.com/e/ob2vuv",
  "https://streamable.com/e/6xiorv",
]

export function VideoShowcase() {
  return (
    <section id="videos" className="pb-16 px-6 scroll-mt-24">
      <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-4">
        {videos.map((src) => (
          <div key={src} className="glass glass-hover">
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
