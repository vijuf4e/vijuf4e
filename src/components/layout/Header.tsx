import { ChevronsUpDown } from "lucide-react"
import { linkTo } from "@/lib/router"
import { DISCORD_URL, products } from "@/lib/products"
import { Badge } from "@/components/ui/panel"
import { cn } from "@/lib/utils"

export function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

const tabs = [
  { href: "/", label: "Genel Bakış" },
  { href: "/valorant", label: "Valorant" },
  { href: "/metin2", label: "Metin2" },
  { href: "/pricing", label: "Fiyatlandırma" },
  { href: "/buy", label: "Satın Al" },
]

const isActive = (path: string, href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(href + "/"))

export function Header({ path }: { path: string }) {
  // Breadcrumb shows the product the visitor is looking at (also on /buy/<slug>)
  const current = products.find((p) => path.split("/").includes(p.slug))

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-7">
        <div className="flex min-w-0 items-center gap-2.5 text-sm">
          <a href="/" onClick={linkTo("/")} className="flex items-center gap-2" aria-label="Xweardes">
            <img src="/logo-w.png" alt="" className="h-8 w-8" />
          </a>
          {current && (
            <>
              <span className="text-neutral-400">/</span>
              <a
                href={`/${current.slug}`}
                onClick={linkTo(`/${current.slug}`)}
                className="flex min-w-0 items-center gap-2 rounded-md px-1.5 py-1 font-medium hover:bg-muted"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
                  <img src={current.logo} alt="" className="max-h-3.5 w-[18px] object-contain" />
                </span>
                <span className="truncate">{current.name}</span>
                <Badge className="hidden sm:inline-flex">{current.status.label}</Badge>
                <ChevronsUpDown className="hidden h-3.5 w-3.5 text-neutral-400 sm:block" />
              </a>
            </>
          )}
        </div>

        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium shadow-xs hover:bg-muted"
        >
          <DiscordIcon className="h-4 w-4" />
          Canlı Destek
        </a>
      </div>

      <nav className="no-scrollbar flex gap-1 overflow-x-auto px-2 sm:px-4">
        {tabs.map(({ href, label }) => {
          const active = isActive(path, href)
          return (
            <a
              key={href}
              href={href}
              onClick={linkTo(href)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative shrink-0 px-3 pb-3 pt-1 text-sm transition-colors",
                active
                  ? "font-medium text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-foreground"
                  : "text-neutral-600 hover:text-foreground"
              )}
            >
              {label}
            </a>
          )
        })}
      </nav>
    </header>
  )
}
