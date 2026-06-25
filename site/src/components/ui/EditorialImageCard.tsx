import { motion } from 'motion/react'
import { type ReactNode } from 'react'
import { cn } from '../../lib/utils'

export function PillBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-block rounded-[var(--radius-pill)] px-[11px] py-[5px] text-[10px] font-medium tracking-[0.08em] text-chalk uppercase',
        'border border-white/10 bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]',
        className,
      )}
    >
      {children}
    </span>
  )
}

type EditorialImageCardProps = {
  src: string
  alt: string
  title: string
  badge?: string
  href?: string
  className?: string
}

function CardInner({ src, alt, title, badge }: Omit<EditorialImageCardProps, 'href' | 'className'>) {
  return (
    <>
      <div className="relative aspect-[4/5] overflow-hidden md:aspect-[3/4]">
        <motion.img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.6 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void-black/90 via-void-black/20 to-transparent" />
        {badge && (
          <div className="absolute top-4 right-4">
            <PillBadge>{badge}</PillBadge>
          </div>
        )}
        <div className="absolute right-0 bottom-0 left-0 p-[19px]">
          <p className="text-[22px] font-medium tracking-[-0.02em] text-chalk">{title}</p>
        </div>
      </div>
    </>
  )
}

export function EditorialImageCard({
  src,
  alt,
  title,
  badge,
  href,
  className,
}: EditorialImageCardProps) {
  const shared =
    'group relative block cursor-pointer overflow-hidden rounded-[var(--radius-card)] shadow-editorial'

  if (href) {
    return (
      <motion.a
        href={href}
        className={cn(shared, className)}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <CardInner src={src} alt={alt} title={title} badge={badge} />
      </motion.a>
    )
  }

  return (
    <motion.div
      className={cn(shared, className)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <CardInner src={src} alt={alt} title={title} badge={badge} />
    </motion.div>
  )
}
