import { linkTo } from "@/lib/router"

// glow classes are written out in full so Tailwind can pick them up
const games = [
  {
    name: "Valorant",
    href: "/valorant",
    logo: "/valorant.png",
    logoClass: "h-28 md:h-36",
    glowClass: "group-hover:drop-shadow-[0_0_28px_rgba(255,70,85,0.45)]",
  },
  {
    name: "Metin2",
    href: "/metin2",
    logo: "/metin2.png",
    logoClass: "w-4/5 max-w-[320px]",
    glowClass: "group-hover:drop-shadow-[0_0_28px_rgba(230,150,60,0.4)]",
  },
]

export function Home() {
  return (
    <section className="flex-1 pt-16 pb-24 px-6 flex items-center">
      <div className="group/grid mx-auto max-w-6xl w-full grid md:grid-cols-2 gap-6">
        {games.map((game) => (
          <a
            key={game.name}
            href={game.href}
            onClick={linkTo(game.href)}
            aria-label={game.name}
            className="group py-10 flex items-center justify-center transition-opacity duration-500 ease-out group-has-[a:hover]/grid:opacity-40 hover:!opacity-100 focus-visible:outline-none motion-reduce:transition-none"
          >
            <img
              src={game.logo}
              alt={game.name}
              className={`${game.logoClass} ${game.glowClass} object-contain transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.03] group-focus-visible:-translate-y-1.5 motion-reduce:transition-none`}
            />
          </a>
        ))}
      </div>
    </section>
  )
}
