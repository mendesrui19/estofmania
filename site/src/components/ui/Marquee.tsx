import { type ReactNode } from 'react'
import { cn } from '../../lib/utils'

type MarqueeProps = {
  children: ReactNode
  /** Seconds for one full loop */
  duration?: number
  direction?: 'left' | 'right'
  className?: string
  trackClassName?: string
  pauseOnHover?: boolean
  /** Duplicate content for seamless loop (default true) */
  duplicate?: boolean
}

export function Marquee({
  children,
  duration = 32,
  direction = 'left',
  className,
  trackClassName,
  pauseOnHover = true,
  duplicate = true,
}: MarqueeProps) {
  return (
    <div
      className={cn('marquee-root overflow-hidden', pauseOnHover && 'marquee-pause-hover', className)}
    >
      <div
        className={cn('marquee-track flex w-max items-stretch gap-4', trackClassName)}
        style={{
          animationDuration: `${duration}s`,
          animationDirection: direction === 'right' ? 'reverse' : 'normal',
        }}
      >
        <div className="flex shrink-0 items-stretch gap-4">{children}</div>
        {duplicate && (
          <div className="flex shrink-0 items-stretch gap-4" aria-hidden>
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

export function MarqueeItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('marquee-item shrink-0', className)}>
      {children}
    </div>
  )
}
