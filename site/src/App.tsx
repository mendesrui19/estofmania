import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { VideoScrollHero } from './components/sections/VideoScrollHero'
import { BrandTicker, BenefitsTicker } from './components/sections/BrandTicker'
import { Services } from './components/sections/Services'
import { Gallery } from './components/sections/Gallery'
import { Process } from './components/sections/Process'
import { Stats, Benefits } from './components/sections/Stats'
import { Reviews } from './components/sections/Reviews'
import { Contact } from './components/sections/Contact'
import { CursorGlow } from './components/ui/CursorGlow'
import { ScrollProgress } from './components/ui/ScrollProgress'

export default function App() {
  return (
    <div className="overflow-x-clip">
      <ScrollProgress />
      <CursorGlow />
      <Header />
      <main className="min-w-0">
        <VideoScrollHero />
        <BrandTicker />
        <Stats />
        <BenefitsTicker />
        <Services />
        <Benefits />
        <Gallery />
        <Process />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
