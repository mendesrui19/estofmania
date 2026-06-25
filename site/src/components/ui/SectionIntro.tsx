import { motion, useReducedMotion } from 'motion/react'
import { SectionLabel } from './ArchiveRow'
import { Reveal } from './Reveal'
import { SplitText } from './SplitText'
import { cn } from '../../lib/utils'

type SectionIntroProps = {
  label: string
  title: string
  lead?: string
  className?: string
  titleClassName?: string
}

export function SectionIntro({
  label,
  title,
  lead,
  className,
  titleClassName = 'text-heading mt-1',
}: SectionIntroProps) {
  const reduced = useReducedMotion()

  return (
    <div className={cn(className)}>
      <Reveal y={18}>
        <SectionLabel>{label}</SectionLabel>
      </Reveal>
      <h2 className={titleClassName}>
        <SplitText text={title} inView />
      </h2>
      {lead && (
        <Reveal delay={0.15} y={14} className="mt-3 max-w-xl">
          <p className="text-body-lg">{lead}</p>
        </Reveal>
      )}
      {!reduced && (
        <motion.div
          className="mt-5 h-px max-w-[120px] origin-left bg-brand/40"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        />
      )}
    </div>
  )
}
