import { motion } from 'motion/react'
import { services } from '../../data/content'
import { Marquee, MarqueeItem } from '../ui/Marquee'

const keywords = [
  ...services.map((s) => s.title),
  'Higienização profissional',
  'Impermeabilização',
  'Orçamento grátis',
  'Famalicão',
]

export function BrandTicker() {
  return (
    <motion.div
      className="relative z-20 -mt-px border-y border-border bg-brand py-3"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <Marquee duration={28} className="select-none">
        {keywords.map((word, i) => (
          <MarqueeItem key={`${word}-${i}`}>
            <span className="flex items-center gap-4 px-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
                {word}
              </span>
              <span className="h-1 w-1 rounded-full bg-white/50" aria-hidden />
            </span>
          </MarqueeItem>
        ))}
      </Marquee>
    </motion.div>
  )
}

export function BenefitsTicker() {
  const items = [
    'Equipamento profissional',
    'Produtos veganos',
    'Ácaros e alergénios',
    'Teste de repelência',
    'Recolha de tapetes',
    'Resposta em 24h',
    'Orçamento grátis',
    'Famalicão e arredores',
  ]

  return (
    <div className="border-y border-border bg-brand-light py-3">
      <Marquee duration={36} direction="right">
        {items.map((item, i) => (
          <MarqueeItem key={`${item}-${i}`}>
            <span className="flex items-center gap-3 rounded-full border border-border bg-white px-4 py-1.5 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
              <span className="text-xs font-medium text-ink">{item}</span>
            </span>
          </MarqueeItem>
        ))}
      </Marquee>
    </div>
  )
}
