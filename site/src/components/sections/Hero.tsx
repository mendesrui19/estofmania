import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { company } from '../../data/content'
import { whatsappUrl } from '../../lib/utils'
import { CtaLink } from '../ui/CtaButton'
import { DisplayWall } from '../ui/DisplayWall'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const textOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <section ref={ref} id="inicio" className="relative min-h-[92svh] overflow-hidden bg-brand-soft">
      <motion.div
        className="section-pad relative z-10 pt-24 md:pt-28"
        style={{ y: textY, opacity: textOpacity }}
      >
        <DisplayWall lines={['ESTOFOS', 'COMO', 'NOVOS.']} />
      </motion.div>

      <div className="section-pad absolute inset-x-0 bottom-8 z-30 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <p className="text-body max-w-md">{company.description}</p>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <p className="text-caption max-w-[16rem] uppercase md:text-right">
            Famalicão e arredores · Orçamento grátis sem compromisso
          </p>
          <CtaLink
            href={whatsappUrl('Olá Estofmania! Quero orçamento grátis.')}
            className="rounded-full bg-brand px-4 py-2 text-white hover:opacity-90"
          >
            Pedir orçamento
          </CtaLink>
        </div>
      </div>

      <motion.p
        className="text-caption absolute bottom-8 left-1/2 z-30 -translate-x-1/2 uppercase text-ink-muted/50"
        animate={{ opacity: [0.4, 0.12, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      >
        Scroll
      </motion.p>
    </section>
  )
}
