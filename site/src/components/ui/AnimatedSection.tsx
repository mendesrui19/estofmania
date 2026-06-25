import { motion, useScroll, useTransform } from 'motion/react'
import { type ReactNode, useRef } from 'react'
import { cn } from '../../lib/utils'

type AnimatedSectionProps = {
  id?: string
  children: ReactNode
  className?: string
  overlap?: boolean
  depth?: boolean
}

export function AnimatedSection({
  id,
  children,
  className,
  overlap = false,
  depth = true,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [60, 0, 0, -40])
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.65, 1, 1, 0.75])
  const rotateX = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [5, 0, 0, -3])
  const scale = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0.97, 1, 1, 0.98])

  return (
    <motion.section
      ref={ref}
      id={id}
      className={cn('relative', overlap && '-mt-16 z-10', className)}
      style={
        depth
          ? {
              y,
              opacity,
              rotateX,
              scale,
              transformPerspective: 1400,
              transformStyle: 'preserve-3d',
            }
          : { y }
      }
    >
      {children}
    </motion.section>
  )
}
