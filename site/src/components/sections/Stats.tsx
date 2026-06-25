import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { benefits, stats } from '../../data/content'
import { SectionIntro } from '../ui/SectionIntro'
import { Stagger, StaggerItem } from '../ui/Reveal'

function AnimatedStat({ value, suffix = '' }: { value: string; suffix?: string }) {
  const match = value.match(/^([\d.]+)(.*)$/)
  const num = match ? parseFloat(match[1]) : NaN
  const trailing = match ? match[2] : ''
  const isNum = !Number.isNaN(num)
  const fullSuffix = trailing + suffix
  const [display, setDisplay] = useState(isNum ? '0' : value)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !isNum) return
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      const start = performance.now()
      const tick = (now: number) => {
        const p = Math.min((now - start) / 1200, 1)
        setDisplay((num * (1 - (1 - p) ** 3)).toFixed(value.includes('.') ? 1 : 0))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
      obs.disconnect()
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [isNum, num, value])

  return (
    <span ref={ref}>
      {isNum ? display : value}
      {fullSuffix}
    </span>
  )
}

export function Stats() {
  return (
    <section className="section-gap-compact section-pad relative z-10 mx-auto max-w-6xl border-t border-border bg-canvas">
      <SectionIntro label="Números" title="Confiança." />

      <Stagger className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
        {stats.map((stat) => (
          <StaggerItem key={stat.label}>
            <motion.div
              className="group flex h-full flex-col justify-between bg-canvas px-5 py-6 md:px-6 md:py-7"
              whileHover={{ backgroundColor: 'var(--color-brand-soft)' }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-ak font-semibold tabular-nums text-stat text-brand transition-transform duration-500 group-hover:scale-[1.03]">
                <AnimatedStat value={stat.value} suffix={'suffix' in stat ? stat.suffix : ''} />
              </p>
              <p className="text-caption mt-4 uppercase">{stat.label}</p>
            </motion.div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}

export function Benefits() {
  return (
    <section className="section-gap-compact w-full border-t border-border bg-brand-light">
      <div className="section-pad w-full">
        <SectionIntro label="Porquê nós" title="Cuidado que se sente." />

        <Stagger className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {benefits.map((b, i) => (
            <StaggerItem key={b}>
              <motion.div
                className="group flex h-full min-h-[4.5rem] items-start gap-3 rounded-xl border border-border/80 bg-white/80 px-4 py-3.5 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-brand/50 hover:shadow-[0_12px_32px_-12px_rgba(128,152,112,0.25)] lg:px-5 lg:py-4"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.25 }}
              >
                <span className="text-caption shrink-0 font-bold uppercase text-brand transition-transform duration-300 group-hover:translate-x-0.5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm leading-snug text-ink lg:text-[0.9375rem]">{b}</span>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
