import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { VideoShowcase } from "@/components/VideoShowcase"
import { Pricing } from "@/components/Pricing"
import { Footer } from "@/components/Footer"

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <VideoShowcase />
      <Pricing />
      <Footer />
    </div>
  )
}

export default App
