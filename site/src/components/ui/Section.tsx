import { motion, useScroll, useTransform } from 'motion/react'
import { type ReactNode, useRef } from 'react'
import { cn } from '../../lib/utils'

export function Section({
  id,
  children,
  className,
}: {
  id?: string
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [56, 0, 0, -32])

  return (
    <motion.section ref={ref} id={id} className={cn('relative', className)} style={{ y }}>
      {children}
    </motion.section>
  )
}
