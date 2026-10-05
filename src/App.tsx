import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"
import { Overview } from "@/pages/Overview"
import { Valorant } from "@/pages/Valorant"
import { Metin2 } from "@/pages/Metin2"
import { Pricing } from "@/pages/Pricing"
import { Buy } from "@/pages/Buy"
import { usePath } from "@/lib/router"
import { useT } from "@/lib/i18n"

type Page = (props: { path: string }) => React.JSX.Element

// First path segment picks the page; pages read sub-paths (tabs) themselves
const pages: Record<string, Page> = {
  valorant: Valorant,
  metin2: Metin2,
  pricing: Pricing,
  buy: Buy,
}

function Footer() {
  const t = useT()
  return (
    <footer className="mt-auto border-t border-border px-4 py-5 sm:px-6">
      <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
        <span>&copy; {new Date().getFullYear()} Xweardes. {t("Tüm hakları saklıdır.", "All rights reserved.")}</span>
        <a href="https://cheatglobal.com" target="_blank" rel="noopener noreferrer" className="opacity-70 transition-opacity hover:opacity-100">
          <img src="/cheatglobal-logo.png" alt="CheatGlobal" className="h-6" />
        </a>
      </div>
    </footer>
  )
}

function App() {
  const path = usePath().replace(/\/+$/, "") || "/"
  const section = path.split("/")[1]
  const Page = pages[section] ?? Overview
  // Checkout is a focused flow like the reference "create" screens: no sidebar
  const withSidebar = section !== "buy"

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header path={path} />
      <div className="flex flex-1">
        {withSidebar && <Sidebar path={path} />}
        <main className="flex min-w-0 flex-1 flex-col">
          <Page path={path} />
          <Footer />
        </main>
      </div>
    </div>
  )
}

export default App
