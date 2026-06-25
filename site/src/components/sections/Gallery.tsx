import { galleryImages } from '../../data/content'
import { SectionIntro } from '../ui/SectionIntro'
import { GalleryCard } from '../ui/GalleryCard'
import { Reveal } from '../ui/Reveal'

export function Gallery() {
  const [featured, ...rest] = galleryImages

  return (
    <section id="galeria" className="section-gap-compact bg-canvas">
      <div className="section-pad mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionIntro label="Galeria · Antes e depois" title="Resultados reais." className="mb-0" />
          <Reveal delay={0.2} y={12}>
            <a
              href="/galeria"
              className="group inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink shadow-sm transition-all duration-300 hover:border-brand hover:text-brand hover:shadow-md"
            >
              Ver tudo
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </Reveal>
        </div>

        <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
          <div className="lg:col-span-7">
            <GalleryCard
              rank={1}
              src={featured.src}
              alt={featured.alt}
              category={featured.category}
              size="featured"
            />
          </div>

          <div className="flex flex-col gap-4 lg:col-span-5 lg:gap-5">
            {rest.map((img, i) => (
              <GalleryCard
                key={img.src}
                rank={i + 2}
                src={img.src}
                alt={img.alt}
                category={img.category}
                delay={0.08 * (i + 1)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
