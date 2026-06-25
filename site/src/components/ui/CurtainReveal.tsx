import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { useRef } from 'react'

const CURTAIN = '/brand/curtain-light.png'

type CurtainRevealProps = {
  image: string
  label: string
  title: string
  caption?: string
}

export function CurtainReveal({ image, label, title, caption }: CurtainRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 28, mass: 0.4 })

  const leftX = useTransform(smooth, [0.04, 0.72], ['0%', '-108%'])
  const rightX = useTransform(smooth, [0.04, 0.72], ['0%', '108%'])
  const leftRotate = useTransform(smooth, [0.04, 0.72], [-2.5, -14])
  const rightRotate = useTransform(smooth, [0.04, 0.72], [2.5, 14])
  const leftSkew = useTransform(smooth, [0.04, 0.72], [0, -3])
  const rightSkew = useTransform(smooth, [0.04, 0.72], [0, 3])
  const curtainOpacity = useTransform(smooth, [0.04, 0.35, 0.72], [0.88, 0.55, 0])
  const imgScale = useTransform(smooth, [0, 0.72], [1.12, 1])
  const closedLabel = useTransform(smooth, [0, 0.18, 0.38], [1, 0.85, 0])
  const contentOpacity = useTransform(smooth, [0.28, 0.58], [0, 1])
  const centreGlow = useTransform(smooth, [0.1, 0.5], [0, 1])

  if (reduced) {
    return (
      <section className="relative bg-canvas">
        <div className="relative h-[70svh] overflow-hidden">
          <img src={image} alt={title} className="h-full w-full bg-brand-light object-contain p-4" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
          <div className="section-pad absolute bottom-0 left-0 pb-10">
            <p className="text-caption uppercase text-ink-muted">{label}</p>
            <h2 className="text-heading-lg mt-3">{title}</h2>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className="relative h-[220vh] bg-canvas">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Revealed stage */}
        <motion.img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full bg-brand-light object-contain p-4 md:p-8"
          style={{ scale: imgScale }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas/80 via-transparent to-transparent" />

        <motion.div
          className="section-pad absolute bottom-0 left-0 z-10 pb-12"
          style={{ opacity: contentOpacity }}
        >
          <p className="text-caption uppercase text-ink-muted">{label}</p>
          <h2 className="text-heading-lg mt-3 text-ink">{title}</h2>
          {caption && <p className="text-body mt-3 max-w-md">{caption}</p>}
        </motion.div>

        {/* Left panel — light, airy, fluid */}
        <motion.div
          className="absolute inset-y-0 left-0 z-20 w-[52%] origin-right"
          style={{
            x: leftX,
            rotate: leftRotate,
            skewY: leftSkew,
            opacity: curtainOpacity,
          }}
        >
          <motion.div
            className="absolute inset-0 bg-cover bg-left"
            style={{
              backgroundImage: `url(${CURTAIN})`,
              backgroundSize: '110% 105%',
            }}
            animate={{ backgroundPosition: ['0% 0%', '2% 1.5%', '0% 0%'] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white/25 via-white/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/8 via-transparent to-white/20" />
        </motion.div>

        {/* Right panel */}
        <motion.div
          className="absolute inset-y-0 right-0 z-20 w-[52%] origin-left"
          style={{
            x: rightX,
            rotate: rightRotate,
            skewY: rightSkew,
            opacity: curtainOpacity,
          }}
        >
          <motion.div
            className="absolute inset-0 bg-cover bg-right"
            style={{
              backgroundImage: `url(${CURTAIN})`,
              backgroundSize: '110% 105%',
            }}
            animate={{ backgroundPosition: ['100% 0%', '98% 1.5%', '100% 0%'] }}
            transition={{ duration: 9.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white/25 via-white/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-l from-white/8 via-transparent to-white/20" />
        </motion.div>

        {/* Soft centre glow as curtains part */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-[15] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06)_0%,transparent_55%)]"
          style={{ opacity: centreGlow }}
          aria-hidden
        />

        {/* Label while closed */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-4"
          style={{ opacity: closedLabel }}
        >
          <p className="text-caption uppercase tracking-[0.28em] text-ink-muted">{label}</p>
          <motion.p
            className="text-caption uppercase text-ink-muted/60"
            animate={{ opacity: [0.35, 0.12, 0.35] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            Scroll para abrir
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
