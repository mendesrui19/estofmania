import { motion, useReducedMotion } from 'motion/react'

type SplitTextProps = {
  text: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'span'
  /** Animate when entering viewport (sections below fold) */
  inView?: boolean
}

export function SplitText({
  text,
  className,
  delay = 0,
  as: Tag = 'span',
  inView = false,
}: SplitTextProps) {
  const reduced = useReducedMotion()
  const words = text.split(' ')

  if (reduced) {
    return <Tag className={className}>{text}</Tag>
  }

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', rotateX: 50, opacity: 0 }}
            {...(inView
              ? {
                  whileInView: { y: 0, rotateX: 0, opacity: 1 },
                  viewport: { once: true, margin: '-50px' },
                }
              : { animate: { y: 0, rotateX: 0, opacity: 1 } })}
            transition={{
              delay: delay + i * 0.07,
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ transformPerspective: 900, transformStyle: 'preserve-3d' }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
