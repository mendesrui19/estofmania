import { type ReactNode } from 'react'
import { cn } from '../../lib/utils'

type CtaLinkProps = {
  href: string
  children: ReactNode
  className?: string
  bold?: boolean
  target?: string
  rel?: string
  onClick?: () => void
}

export function CtaLink({
  href,
  children,
  className,
  bold = true,
  target,
  rel,
  onClick,
}: CtaLinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      className={cn(
        'cursor-pointer text-caption uppercase text-brand transition-opacity hover:opacity-70',
        bold && 'text-caption-bold',
        className,
      )}
    >
      {children}
    </a>
  )
}

/** @deprecated flat link only */
export function CtaButton({
  href,
  children,
  className,
  target,
  rel,
  onClick,
}: {
  href: string
  children: ReactNode
  className?: string
  target?: string
  rel?: string
  onClick?: () => void
  variant?: string
  size?: string
  showArrow?: boolean
}) {
  return (
    <CtaLink href={href} className={className} target={target} rel={rel} onClick={onClick}>
      {children} →
    </CtaLink>
  )
}
