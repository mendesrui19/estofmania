import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { useCallback, useRef } from 'react'

type GalleryCardProps = {
  rank: number
  src: string
  alt: string
  category?: string
  size?: 'featured' | 'compact'
  delay?: number
}

const categoryLabel: Record<string, string> = {
  estofos: 'Estofos',
  tapetes: 'Tapetes',
}

export function GalleryCard({
  rank,
  src,
  alt,
  category,
  size = 'compact',
  delay = 0,
}: GalleryCardProps) {
  const featured = size === 'featured'
  const cardRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const springX = useSpring(pointerX, { stiffness: 120, damping: 18 })
  const springY = useSpring(pointerY, { stiffness: 120, damping: 18 })
  const imgX = useTransform(springX, [-0.5, 0.5], featured ? [-14, 14] : [-8, 8])
  const imgY = useTransform(springY, [-0.5, 0.5], featured ? [-10, 10] : [-6, 6])

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduced || !cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      pointerX.set((e.clientX - rect.left) / rect.width - 0.5)
      pointerY.set((e.clientY - rect.top) / rect.height - 0.5)
    },
    [pointerX, pointerY, reduced],
  )

  const resetPointer = useCallback(() => {
    pointerX.set(0)
    pointerY.set(0)
  }, [pointerX, pointerY])

  return (
    <motion.article
      ref={cardRef}
      className={`group relative overflow-hidden rounded-2xl border border-border bg-white shadow-sm ${
        featured ? 'flex h-full min-h-[320px] flex-col lg:min-h-[480px]' : 'flex flex-col'
      }`}
      initial={reduced ? false : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduced ? undefined : { y: -6, boxShadow: '0 24px 48px -16px rgba(36, 48, 40, 0.12)' }}
      onMouseMove={onMove}
      onMouseLeave={resetPointer}
    >
      <div className="absolute inset-x-0 top-0 z-10 h-[2px] origin-left scale-x-0 bg-brand transition-transform duration-500 group-hover:scale-x-100" />

      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="font-gs text-2xl leading-none text-brand transition-transform duration-500 group-hover:translate-x-1 md:text-3xl">
          {String(rank).padStart(2, '0')}
        </span>
        {category && (
          <span className="rounded-full bg-brand-light px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
            {categoryLabel[category] ?? category}
          </span>
        )}
      </div>

      <div
        className={`relative flex flex-1 items-center overflow-hidden bg-brand-soft/40 ${
          featured ? 'p-4 md:p-6' : 'p-3'
        }`}
      >
        <motion.div className="w-full" style={reduced ? undefined : { x: imgX, y: imgY }}>
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className={`mx-auto w-full object-contain transition-transform duration-700 group-hover:scale-[1.03] ${
              featured ? 'max-h-[min(52vh,420px)]' : 'max-h-[min(28vh,200px)] md:max-h-[220px]'
            }`}
          />
        </motion.div>
      </div>

      <p className="border-t border-border px-4 py-3 text-xs font-medium leading-snug text-ink-muted transition-colors duration-300 group-hover:text-ink md:text-sm">
        {alt}
      </p>
    </motion.article>
  )
}
