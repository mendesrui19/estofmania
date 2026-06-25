import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { type ReactNode, useRef } from 'react'
import { cn } from '../../lib/utils'

export function Parallax({
  children,
  className,
  speed = 0.4,
}: {
  children: ReactNode
  className?: string
  speed?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [speed * 80, speed * -80])

  return (
    <motion.div ref={ref} className={cn(className)} style={reduced ? undefined : { y }}>
      {children}
    </motion.div>
  )
}
