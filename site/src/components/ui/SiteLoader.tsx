import { motion, useReducedMotion } from 'motion/react'
import type { PreloadProgress } from '../../lib/preload'

const LOGO_SRC = '/brand/logo.png'
const RING_R = 46
const RING_C = 2 * Math.PI * RING_R

type SiteLoaderProps = {
  progress: PreloadProgress
  exiting?: boolean
}

function LogoLoaderRing({
  ratio,
  reduced,
}: {
  ratio: number
  reduced: boolean | null
}) {
  const offset = RING_C * (1 - ratio)

  return (
    <div
      className="relative mx-auto size-[clamp(7rem,26vw,11rem)] shrink-0"
      aria-hidden
    >
      <svg
        className="absolute inset-0 size-full -rotate-90"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle
          cx="50"
          cy="50"
          r={RING_R}
          stroke="rgba(216, 226, 211, 0.95)"
          strokeWidth="2.25"
        />
        <circle
          cx="50"
          cy="50"
          r={RING_R}
          stroke="url(#loader-ring-gradient)"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeDasharray={RING_C}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
        <defs>
          <linearGradient id="loader-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#809870" />
            <stop offset="100%" stopColor="#63785a" />
          </linearGradient>
        </defs>
      </svg>

      {!reduced && ratio < 1 && (
        <motion.span
          className="absolute -inset-1 rounded-full border-2 border-transparent border-t-brand/50 border-r-brand/15"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.35, repeat: Infinity, ease: 'linear' }}
        />
      )}

      <div className="absolute inset-[11%] overflow-hidden rounded-full bg-white shadow-[0_10px_36px_rgba(128,152,112,0.2)] ring-2 ring-brand/20">
        <img
          src={LOGO_SRC}
          alt=""
          className="size-full object-cover"
          width={168}
          height={168}
          decoding="sync"
        />
      </div>
    </div>
  )
}

export function SiteLoader({ progress, exiting = false }: SiteLoaderProps) {
  const reduced = useReducedMotion()
  const pct = Math.round(progress.ratio * 100)

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-canvas"
      initial={false}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: reduced ? 0.2 : 0.75, ease: [0.76, 0, 0.24, 1] }}
      aria-live="polite"
      aria-busy={!exiting}
      role="status"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_45%,rgba(128,152,112,0.14),transparent_65%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-soft/80 via-canvas to-canvas"
        aria-hidden
      />

      <motion.div
        className="relative z-10 flex w-full max-w-sm flex-col items-center px-6 text-center"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: exiting ? 0 : 1, scale: exiting ? 0.98 : 1 }}
        transition={{ duration: reduced ? 0.15 : 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <LogoLoaderRing ratio={progress.ratio} reduced={reduced} />

        <p className="mt-8 font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
          Estofmania
        </p>

        <p
          className="mt-3 max-w-[26ch] font-display text-[13px] font-medium leading-relaxed text-ink-muted"
          key={progress.label}
        >
          {progress.label}
        </p>

        <div className="mt-7 w-full max-w-[240px]">
          <div className="flex items-center justify-between font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted/70">
            <span>A carregar</span>
            <span aria-label={`${pct} por cento`}>{pct}%</span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand to-brand-dark transition-[width] duration-500 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[28vh] bg-gradient-to-t from-brand-soft/90 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? 1 : 0 }}
        transition={{ duration: reduced ? 0.15 : 0.85, ease: [0.76, 0, 0.24, 1] }}
        aria-hidden
      />
    </motion.div>
  )
}
