import { galleryImages } from '../data/content'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { SectionLabel } from '../components/ui/ArchiveRow'
import { GalleryCard } from '../components/ui/GalleryCard'

export default function GalleryPage() {
  return (
    <>
      <Header variant="light" />
      <main className="bg-canvas pt-[4.25rem]">
        <section className="section-gap-compact section-pad mx-auto max-w-6xl">
          <a
            href="/"
            className="text-caption mb-6 inline-flex cursor-pointer items-center gap-2 uppercase text-ink-muted transition-colors hover:text-brand"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao início
          </a>

          <SectionLabel>Galeria · Antes e depois</SectionLabel>
          <h1 className="text-heading mt-1">Todos os resultados.</h1>
          <p className="text-body mt-3 max-w-xl">
            Transformações reais em estofos e tapetes — higienização profissional Estofmania.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((img, i) => (
              <GalleryCard
                key={img.src}
                rank={i + 1}
                src={img.src}
                alt={img.alt}
                category={img.category}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
