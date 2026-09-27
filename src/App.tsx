import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { VideoShowcase } from "@/components/VideoShowcase"
import { Features } from "@/components/Features"
import { Pricing } from "@/components/Pricing"
import { Footer } from "@/components/Footer"

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <VideoShowcase />
      <Features />
      <Pricing />
      <Footer />
    </div>
  )
}

export default App
