import { motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect } from 'react'

export function CursorGlow() {
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const sx = useSpring(x, { stiffness: 90, damping: 24 })
  const sy = useSpring(y, { stiffness: 90, damping: 24 })

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [x, y])

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9998] hidden h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full md:block"
      style={{
        x: sx,
        y: sy,
        background:
          'radial-gradient(circle, rgba(135,163,119,0.18) 0%, rgba(135,163,119,0.06) 45%, transparent 70%)',
      }}
      aria-hidden
    />
  )
}
