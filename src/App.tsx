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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar path={path} />
      <Page />
      <Footer />
    </div>
  )
}

export default App
