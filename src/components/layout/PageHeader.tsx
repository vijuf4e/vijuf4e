import { ArrowLeft } from "lucide-react"
import { linkTo } from "@/lib/router"
import { cn } from "@/lib/utils"

/** Title band across the content area, with optional back link and underline tabs */
export function PageHeader({
  title,
  path,
  back,
  tabs,
  className,
}: {
  title: string
  path: string
  back?: string
  tabs?: { href: string; label: string }[]
  className?: string
}) {
  return (
    <div className="border-b border-border">
      <div className={cn("mx-auto w-full px-4 sm:px-6", className)}>
        <div className={cn("flex items-center gap-4", tabs ? "pt-9 pb-5" : "py-9")}>
          {back && (
            <a
              href={back}
              onClick={linkTo(back)}
              aria-label="Geri"
              className="-ml-1 rounded-md p-1 text-foreground hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </a>
          )}
          <h1 className="text-2xl font-semibold tracking-tight sm:text-[30px]">{title}</h1>
        </div>
        {tabs && (
          <nav className="no-scrollbar -mx-3 flex overflow-x-auto">
            {tabs.map((tab) => {
              const active = tab.href === path
              return (
                <a
                  key={tab.href}
                  href={tab.href}
                  onClick={linkTo(tab.href)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative shrink-0 px-3 pb-2.5 text-sm transition-colors",
                    active
                      ? "font-medium text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-foreground"
                      : "text-neutral-600 hover:text-foreground"
                  )}
                >
                  {tab.label}
                </a>
              )
            })}
          </nav>
        )}
      </div>
    </div>
  )
}
