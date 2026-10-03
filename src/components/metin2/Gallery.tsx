const youtubeId = "r5rVcPRuus4"

export function Gallery() {
  return (
    <section id="gallery" className="pb-16 px-6 scroll-mt-24">
      <div className="mx-auto max-w-5xl">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
          title="Metin2 video"
          className="w-full aspect-video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </section>
  )
}
