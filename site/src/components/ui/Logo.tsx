import { cn } from '../../lib/utils'

export function Logo({ className, height = 36 }: { className?: string; height?: number }) {
  return (
    <a
      href="/"
      aria-label="Estofmania — início"
      className={cn('inline-flex shrink-0 cursor-pointer', className)}
    >
      <img
        src="/brand/logo.png"
        alt="Estofmania"
        style={{ height }}
        className="w-auto rounded-full object-cover"
      />
    </a>
  )
}
