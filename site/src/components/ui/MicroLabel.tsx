import { type ReactNode } from 'react'
import { cn } from '../../lib/utils'

export function MetaLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('meta-label', className)}>{children}</span>
}

/** @deprecated use MetaLabel */
export const MicroLabel = MetaLabel
export const BrandTick = () => <span className="inline-block h-px w-10 bg-graphite" aria-hidden />
