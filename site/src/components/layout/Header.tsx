import { motion, useScroll, useTransform } from 'motion/react'
import { Logo } from '../ui/Logo'
import { navLinks } from '../../data/content'
import { whatsappUrl } from '../../lib/utils'

type HeaderProps = {
  variant?: 'hero' | 'light'
}

export function Header({ variant = 'hero' }: HeaderProps) {
  const { scrollY } = useScroll()
  const heroSolid = useTransform(scrollY, [0, 280], [0, 1])
  const heroBg = useTransform(heroSolid, (v) => `rgba(16, 9, 4, ${0.45 + v * 0.55})`)
  const light = variant === 'light'

  return (
    <motion.header
      className={`fixed inset-x-0 top-0 z-50 border-b ${
        light ? 'border-border bg-canvas/95' : 'border-cork-shadow/60'
      }`}
      style={
        light
          ? undefined
          : {
              backgroundColor: heroBg,
            }
      }
    >
      <div className="section-pad flex h-[4.25rem] items-center justify-between">
        <Logo height={32} />

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.slice(0, 4).map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-display cursor-pointer text-[12px] font-medium transition-opacity duration-300 ease-out hover:opacity-70 ${
                light ? 'text-ink-muted hover:text-brand' : 'text-warm-cream'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={whatsappUrl('Olá! Quero orçamento grátis.')}
          className={`font-display cursor-pointer rounded-[22.5px] border px-3 py-[7px] text-[11px] font-normal transition-[border-color,opacity] duration-300 ease-out hover:opacity-80 sm:px-4 sm:text-[12px] ${
            light
              ? 'border-brand bg-brand text-white'
              : 'border-warm-cream text-warm-cream hover:border-burnt-sienna'
          }`}
        >
          Orçamento grátis
        </a>
      </div>
    </motion.header>
  )
}
