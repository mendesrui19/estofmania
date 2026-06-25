import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { useRef } from 'react'

const RUG = '/antes-depois/tapete.png'

type RugRevealProps = {
  label: string
  title: string
  caption?: string
}

export function RugReveal({ label, title, caption }: RugRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  // Bottom inset shrinks from 100% (rolled up) to 0% (fully unrolled)
  const hidden = useTransform(scrollYProgress, [0.08, 0.62], [100, 0])
  const clipPath = useMotionTemplate`inset(0% 0% ${hidden}% 0%)`
  // Rolled edge slides down as the rug unrolls
  const rollTop = useTransform(scrollYProgress, [0.08, 0.62], ['0%', '100%'])
  const rollOpacity = useTransform(
    scrollYProgress,
    [0.08, 0.12, 0.58, 0.62],
    [0, 1, 1, 0],
  )
  const contentOpacity = useTransform(scrollYProgress, [0.45, 0.62], [0, 1])
  const closedLabel = useTransform(scrollYProgress, [0, 0.2, 0.4], [1, 1, 0])

  if (reduced) {
    return (
      <section className="relative bg-canvas">
        <div className="relative h-[70svh] overflow-hidden">
          <img src={RUG} alt={title} className="h-full w-full bg-brand-light object-contain p-4" />
          <div className="absolute inset-0 bg-gradient-to-t from-canvas/60 via-transparent to-transparent" />
          <div className="section-pad absolute bottom-0 left-0 pb-10">
            <p className="text-caption uppercase text-ink-muted">{label}</p>
            <h2 className="text-heading-lg mt-3">{title}</h2>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className="relative h-[240vh] bg-canvas">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* The rug, revealed top-to-bottom */}
        <motion.div
          className="absolute inset-0 bg-brand-light bg-contain bg-center bg-no-repeat"
          style={{
            clipPath,
            backgroundImage: `url(${RUG})`,
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas/70 via-transparent to-transparent" />

        {/* Rolled edge sliding down */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 z-20 h-10 -translate-y-1/2"
          style={{ top: rollTop, opacity: rollOpacity }}
        >
          <div className="h-full w-full bg-gradient-to-b from-black via-white/15 to-black shadow-[0_24px_40px_rgba(0,0,0,0.7)]" />
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/25" />
        </motion.div>

        {/* Caption once unrolled */}
        <motion.div
          className="section-pad absolute bottom-0 left-0 z-10 pb-12"
          style={{ opacity: contentOpacity }}
        >
          <p className="text-caption uppercase text-ink-muted">{label}</p>
          <h2 className="text-heading-lg mt-3 text-ink">{title}</h2>
          {caption && <p className="text-body mt-3 max-w-md">{caption}</p>}
        </motion.div>

        {/* Label while still rolled up */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-4"
          style={{ opacity: closedLabel }}
        >
          <p className="text-caption uppercase tracking-[0.3em] text-ink-muted">{label}</p>
          <motion.p
            className="text-caption uppercase text-ink-muted/60"
            animate={{ opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          >
            Scroll para estender
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
