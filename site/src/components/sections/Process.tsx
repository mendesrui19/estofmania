import { motion } from 'motion/react'
import { processSteps } from '../../data/content'
import { Marquee, MarqueeItem } from '../ui/Marquee'
import { SectionIntro } from '../ui/SectionIntro'

function ProcessCard({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <motion.div
      className="group relative flex w-[min(78vw,300px)] flex-col overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-sm md:w-[320px]"
      whileHover={{
        y: -8,
        borderColor: 'var(--color-brand)',
        boxShadow: '0 20px 40px -14px rgba(128, 152, 112, 0.28)',
      }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-brand transition-transform duration-500 group-hover:scale-x-100" />
      <span className="font-gs text-2xl text-brand transition-transform duration-500 group-hover:translate-x-1">
        {step}
      </span>
      <h3 className="text-archive-title mt-3 transition-colors duration-300 group-hover:text-brand">
        {title}
      </h3>
      <p className="text-body mt-2 line-clamp-3">{description}</p>
    </motion.div>
  )
}

export function Process() {
  return (
    <section id="processo" className="section-gap-compact overflow-hidden bg-canvas">
      <div className="section-pad mx-auto mb-6 max-w-6xl">
        <SectionIntro label="Processo" title="Simples e rápido." />
      </div>

      <Marquee duration={40} trackClassName="gap-4 px-4">
        {processSteps.map((step) => (
          <MarqueeItem key={step.step}>
            <ProcessCard step={step.step} title={step.title} description={step.description} />
          </MarqueeItem>
        ))}
      </Marquee>
    </section>
  )
}
