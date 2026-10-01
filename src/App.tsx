import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Home } from "@/pages/Home"
import { Valorant } from "@/pages/Valorant"
import { Metin2 } from "@/pages/Metin2"
import { usePath } from "@/lib/router"

const pages: Record<string, () => React.JSX.Element> = {
  "/valorant": Valorant,
  "/metin2": Metin2,
}

function App() {
  const path = usePath().replace(/\/+$/, "") || "/"
  const Page = pages[path] ?? Home

  return (
    <div className="relative isolate min-h-screen flex flex-col overflow-x-clip bg-background">
      {/* Blurred gold glows behind every page */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-56 -top-80 h-[720px] w-[720px] rounded-full bg-[radial-gradient(closest-side,#b45309,transparent)] opacity-50" />
        <div className="absolute -left-52 top-[520px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,#713f12,transparent)] opacity-35" />
      </div>
      <Navbar path={path} />
      <Page />
      <Footer />
    </div>
  )
}

export default App
