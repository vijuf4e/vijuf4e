export function Hero() {
  return (
    <section className="pt-28 pb-8 px-6">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-muted-foreground">
            Xweardes / Advanced Color Trigger
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-none text-foreground">
            Level Up Your Game
          </h1>
        </div>
        <p className="text-base text-muted-foreground max-w-sm leading-relaxed">
          Premium tools designed to give you the competitive edge. Fast, reliable, and undetected.
        </p>
      </div>
    </section>
  )
}
