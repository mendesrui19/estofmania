import { motion } from 'motion/react'
import { googleReviewsUrl, googleWriteReviewUrl, reviews } from '../../data/reviews'
import { Marquee, MarqueeItem } from '../ui/Marquee'
import { SectionIntro } from '../ui/SectionIntro'

function GoogleLogo({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden width={size} height={size}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function StarRow({ className }: { className?: string }) {
  return (
    <div className={`flex gap-1 ${className ?? ''}`} aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="#FBBC04">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function GoogleWriteReviewCta() {
  return (
    <motion.div
      className="relative border-y border-cork-shadow bg-studio-black"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="section-pad mx-auto max-w-6xl py-7 md:py-9">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          {/* Score + copy — bloco único */}
          <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center sm:gap-6 md:gap-8">
            <div className="flex shrink-0 items-center gap-3 md:gap-4">
              <p className="font-gs text-[clamp(2.25rem,5vw,3rem)] leading-none text-warm-cream">
                5,0
              </p>
              <StarRow />
            </div>

            <div className="hidden h-10 w-px shrink-0 bg-cork-shadow sm:block" aria-hidden />

            <div className="min-w-0">
              <p className="text-kicker-cream">Google · Estofmania</p>
              <p className="font-gs mt-1.5 max-w-[26ch] text-[13px] italic leading-snug text-warm-cream/82 md:text-sm">
                Partilhe a sua experiência connosco.
              </p>
            </div>
          </div>

          {/* Ações */}
          <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:min-w-[260px] lg:items-end">
            <motion.a
              href={googleWriteReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-full cursor-pointer items-center justify-between gap-3 border border-warm-cream/25 bg-dark-cork px-5 py-3.5 transition-[border-color,background-color] duration-300 ease-out hover:border-warm-cream sm:min-w-[260px]"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.25 }}
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <GoogleLogo size={16} />
                <span className="font-display truncate text-[14px] font-medium text-warm-cream">
                  Escrever opinião no Google
                </span>
              </span>
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 shrink-0 text-warm-cream/70 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-warm-cream"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </motion.a>

            <a
              href={googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display inline-flex cursor-pointer items-center justify-center gap-2 text-[12px] text-grey-brown transition-colors duration-300 hover:text-warm-cream/80 lg:justify-end"
            >
              <span className="border-b border-cork-shadow pb-0.5">Ver críticas existentes</span>
              <GoogleLogo size={13} />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function GoogleReviewCard({
  author,
  rating,
  relativeTime,
  meta,
  text,
}: {
  author: string
  rating: number
  relativeTime: string
  meta: string
  text: string
}) {
  return (
    <motion.article
      className="flex h-full w-[min(85vw,340px)] flex-col border-t border-border bg-canvas pt-5 md:w-[360px]"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="font-display text-sm font-semibold text-ink">{author}</p>
          {meta && <p className="mt-0.5 text-[11px] text-ink-muted/75">{meta}</p>}
        </div>
        <span className="text-[11px] tabular-nums text-ink-muted">{relativeTime}</span>
      </div>

      <div className="mt-3 flex gap-0.5" aria-label={`${rating} em 5 estrelas`}>
        {Array.from({ length: 5 }, (_, i) => (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className="h-3 w-3"
            aria-hidden
            fill={i < rating ? '#809870' : '#d8e2d3'}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>

      <p className="font-gs mt-4 flex-1 text-[15px] leading-[1.55] text-ink/90">&ldquo;{text}&rdquo;</p>

      <div className="mt-5 flex items-center gap-1.5">
        <GoogleLogo size={14} />
        <span className="text-[10px] uppercase tracking-[0.14em] text-ink-muted">Google</span>
      </div>
    </motion.article>
  )
}

export function Reviews() {
  return (
    <section id="avaliacoes" className="section-gap-compact overflow-hidden bg-canvas">
      <div className="section-pad mx-auto max-w-6xl">
        <SectionIntro label="Críticas Google" title="O que dizem os clientes." />
      </div>

      <div className="mt-8">
        <GoogleWriteReviewCta />
      </div>

      <div className="mt-10">
        <Marquee duration={56} trackClassName="gap-8 px-4">
          {reviews.map((review) => (
            <MarqueeItem key={review.id}>
              <GoogleReviewCard {...review} />
            </MarqueeItem>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
