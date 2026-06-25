import { motion, useScroll, useTransform } from 'motion/react'
import { company, navLinks } from '../../data/content'
import { Logo } from '../ui/Logo'
import { Reveal } from '../ui/Reveal'

export function Footer() {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0.85, 1], [0.6, 1])

  return (
    <motion.footer
      className="border-t border-border bg-brand-light pb-8 pt-6"
      style={{ opacity }}
    >
      <div className="section-pad mx-auto max-w-6xl">
        <Reveal y={16}>
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:gap-4">
              <Logo height={30} />
              <span className="text-caption text-ink-muted/80">
                © {new Date().getFullYear()} {company.name}
              </span>
            </div>

            <nav
              className="flex flex-wrap justify-center gap-x-5 gap-y-2"
              aria-label="Navegação do rodapé"
            >
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-[11px] cursor-pointer font-medium uppercase tracking-[0.12em] text-ink-muted transition-colors duration-300 hover:text-brand"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </Reveal>
      </div>
    </motion.footer>
  )
}
