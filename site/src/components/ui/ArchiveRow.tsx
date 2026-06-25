import { motion } from 'motion/react'
import { type ReactNode } from 'react'
import { cn } from '../../lib/utils'

export function ArchiveRow({
  title,
  meta,
  tags,
  href,
  index,
}: {
  title: string
  meta: string
  tags: string[]
  href?: string
  index: number
}) {
  const inner = (
    <>
      <h3 className="text-archive-title">{title}</h3>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-2 md:mt-0 md:ml-auto md:flex-col md:items-end">
        <span className="text-caption uppercase text-brand">{meta}</span>
        {tags.map((tag) => (
          <span key={tag} className="text-caption uppercase text-ink-muted">
            {tag}
          </span>
        ))}
      </div>
    </>
  )

  const className = cn(
    'group flex flex-col gap-3 border-t border-border py-6 md:flex-row md:items-end md:justify-between',
  )

  if (href) {
    return (
      <motion.a
        href={href}
        className={cn(className, 'cursor-pointer')}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ delay: index * 0.06, duration: 0.6 }}
        whileHover={{ opacity: 0.8 }}
      >
        {inner}
      </motion.a>
    )
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
    >
      {inner}
    </motion.div>
  )
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-kicker mb-4">{children}</p>
}
