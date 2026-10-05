import { useState } from "react"
import { ChevronDown, LayoutGrid, Receipt } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { linkTo } from "@/lib/router"
import { DISCORD_URL } from "@/lib/products"
import { DiscordIcon } from "@/components/layout/Header"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n"
import type { Text } from "@/lib/i18n"

interface Item {
  href: string
  label: Text
  icon: LucideIcon | string
  children?: { href: string; label: Text }[]
}

const overview = { tr: "Genel Bakış", en: "Overview" }
const buy = { tr: "Satın Al", en: "Buy" }

const items: Item[] = [
  { href: "/", label: overview, icon: LayoutGrid },
  {
    href: "/valorant",
    label: { tr: "Valorant", en: "Valorant" },
    icon: "/valorant.png",
    children: [
      { href: "/valorant", label: overview },
      { href: "/valorant/features", label: { tr: "Özellikler", en: "Features" } },
      { href: "/valorant/videos", label: { tr: "Videolar", en: "Videos" } },
      { href: "/buy/valorant", label: buy },
    ],
  },
  {
    href: "/metin2",
    label: { tr: "Metin2", en: "Metin2" },
    icon: "/metin2.png",
    children: [
      { href: "/metin2", label: overview },
      { href: "/metin2/video", label: { tr: "Video", en: "Video" } },
      { href: "/buy/metin2", label: buy },
    ],
  },
  { href: "/pricing", label: { tr: "Fiyatlandırma", en: "Pricing" }, icon: Receipt },
]

const rowClass = "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors"

export function Sidebar({ path }: { path: string }) {
  // Groups start open; the one for the current section is always open
  const [closed, setClosed] = useState<string[]>([])
  const t = useT()

  return (
    <aside className="hidden w-[244px] shrink-0 border-r border-border bg-background md:block">
      <div className="sticky top-[105px] flex flex-col gap-0.5 p-4">
        <span className="mb-2 px-3 text-xs font-medium tracking-wide text-neutral-600">{t("ÜRÜNLER", "PRODUCTS")}</span>
        {items.map((item) => {
          const Icon = item.icon
          const icon =
            typeof Icon === "string" ? (
              <span className="flex w-8 shrink-0 justify-center">
                <img src={Icon} alt="" className="h-4 w-4 object-contain" />
              </span>
            ) : (
              <span className="flex w-8 shrink-0 justify-center">
                <Icon className="h-4 w-4" strokeWidth={1.8} />
              </span>
            )
          if (!item.children) {
            const active = path === item.href
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={linkTo(item.href)}
                className={cn(rowClass, active ? "bg-neutral-200/70 font-medium" : "text-neutral-700 hover:bg-muted")}
              >
                {icon}
                {t(item.label)}
              </a>
            )
          }

          const inGroup = item.children.some((c) => c.href === path)
          const open = inGroup || !closed.includes(item.href)
          return (
            <div key={item.href}>
              <button
                type="button"
                onClick={() =>
                  setClosed((c) => (c.includes(item.href) ? c.filter((h) => h !== item.href) : [...c, item.href]))
                }
                aria-expanded={open}
                className={cn(rowClass, inGroup ? "bg-neutral-200/70 font-medium" : "text-neutral-700 hover:bg-muted")}
              >
                {icon}
                {t(item.label)}
                <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", !open && "-rotate-90")} />
              </button>
              {open && (
                <div className="my-1 ml-[18px] flex flex-col border-l border-border">
                  {item.children.map((child) => {
                    const active = child.href === path
                    return (
                      <a
                        key={child.href}
                        href={child.href}
                        onClick={linkTo(child.href)}
                        className={cn(
                          "-ml-px border-l py-1.5 pl-4 text-sm transition-colors",
                          active
                            ? "border-foreground font-medium text-foreground"
                            : "border-transparent text-neutral-600 hover:text-foreground"
                        )}
                      >
                        {t(child.label)}
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        <span className="mb-2 mt-6 px-3 text-xs font-medium tracking-wide text-neutral-600">{t("DESTEK", "SUPPORT")}</span>
        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(rowClass, "text-neutral-700 hover:bg-muted")}
        >
          <span className="flex w-8 shrink-0 justify-center">
            <DiscordIcon className="h-4 w-4" />
          </span>
          Discord
        </a>
      </div>
    </aside>
  )
}
