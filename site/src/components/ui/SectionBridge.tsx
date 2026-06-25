import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { cn } from '../../lib/utils'

const fills: Record<string, string> = {
  'brand-light': '#f6f8f4',
  'brand-deep': '#3d4f38',
  white: '#ffffff',
  brand: '#87a377',
}

type SectionBridgeProps = {
  from: keyof typeof fills
  to: keyof typeof fills
  className?: string
  overlap?: number
}

export function SectionBridge({ from, to, className, overlap = 64 }: SectionBridgeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [overlap * 0.5, -overlap * 0.5])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.08])
  const layerOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5])

  return (
    <div
      ref={ref}
      className={cn('relative z-20 -mt-px h-[clamp(48px,8vw,96px)]', className)}
      style={{ marginBottom: -overlap }}
      aria-hidden
    >
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="h-full w-full">
          <path
            d="M0,64 C360,120 720,0 1080,64 C1260,96 1380,80 1440,64 L1440,120 L0,120 Z"
            fill={fills[from]}
          />
          <motion.path
            d="M0,80 C320,20 640,110 960,50 C1200,10 1320,40 1440,70 L1440,120 L0,120 Z"
            fill={fills[to]}
            style={{ opacity: layerOpacity }}
          />
        </svg>
      </motion.div>
    </div>
  )
}
