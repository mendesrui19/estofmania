import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { cn } from '../../lib/utils'

export function DisplayWall({
  lines,
  className,
}: {
  lines: string[]
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -80])

  return (
    <motion.div ref={ref} className={cn('overflow-hidden', className)} style={{ x }}>
      {lines.map((line, i) => (
        <motion.h1
          key={line}
          className="text-wall whitespace-nowrap"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginLeft: i % 2 === 1 ? '-0.08em' : 0 }}
        >
          {line}
        </motion.h1>
      ))}
    </motion.div>
  )
}

export function SculptureFloat({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '30%'])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 0.92])
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0.4])

  return (
    <motion.div
      ref={ref}
      className={cn('pointer-events-none relative z-20 flex justify-center', className)}
      style={{ y, scale, opacity }}
    >
      <img
        src={src}
        alt={alt}
        className="sculpture-img max-h-[min(52vh,520px)] w-auto max-w-[min(90vw,640px)] object-contain"
      />
    </motion.div>
  )
}
