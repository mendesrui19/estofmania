import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { services } from '../../data/content'
import { isTouchDevice } from '../../lib/device'
import { whatsappUrl } from '../../lib/utils'
import { SectionLabel } from '../ui/ArchiveRow'

const EASE = [0.22, 1, 0.36, 1] as const
const CARD_SELECTOR = '[data-service-card]'
/** vh per card — scroll “consumido” antes de libertar a página */
const VH_PER_CARD = isTouchDevice() ? 52 : 78
const SCROLL_HEIGHT = `${services.length * VH_PER_CARD}vh`

function easeProgress(p: number) {
  return 1 - (1 - p) ** 1.15
}

function cascadeDelay(index: number, active: number | null) {
  if (active === null) return 0
  return Math.abs(index - active) * 0.055
}

function ServiceCard({
  service,
  index,
  activeIndex,
  onActivate,
}: {
  service: (typeof services)[number]
  index: number
  activeIndex: number | null
  onActivate: (i: number) => void
}) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const reduced = useReducedMotion()

  const isActive = activeIndex === index
  const hasActive = activeIndex !== null

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduced || !isActive || !cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      rotateX.set(-py * 9)
      rotateY.set(px * 9)
    },
    [isActive, reduced, rotateX, rotateY],
  )

  const resetTilt = useCallback(() => {
    rotateX.set(0)
    rotateY.set(0)
  }, [rotateX, rotateY])

  let targetY = 0
  let targetScale = 1
  let targetOpacity = 1
  let targetX = 0

  if (hasActive) {
    const d = index - activeIndex!
    if (d === 0) {
      targetY = -14
      targetScale = 1.04
      targetOpacity = 1
    } else if (d < 0) {
      targetY = 4
      targetX = -10 + d * 4
      targetScale = 0.94
      targetOpacity = 0.68
    } else {
      targetY = 4
      targetX = 10 + d * 4
      targetScale = 0.94
      targetOpacity = 0.68
    }
  }

  return (
    <motion.a
      ref={cardRef}
      href={whatsappUrl(`Informações sobre ${service.title}`)}
      data-service-card
      className="group relative flex h-full min-h-[260px] w-[min(78vw,300px)] shrink-0 flex-col overflow-hidden rounded-2xl border bg-white p-5 will-change-transform sm:w-[min(72vw,320px)] md:min-h-[280px] md:w-[340px] md:p-6"
      style={
        reduced
          ? undefined
          : {
              rotateX: isActive ? rotateX : 0,
              rotateY: isActive ? rotateY : 0,
              transformPerspective: 900,
              transformStyle: 'preserve-3d',
            }
      }
      animate={{
        y: targetY,
        x: targetX,
        scale: targetScale,
        opacity: targetOpacity,
        borderColor: isActive ? 'var(--color-brand)' : 'var(--color-border)',
        boxShadow: isActive
          ? '0 20px 40px -12px rgba(128, 152, 112, 0.32)'
          : '0 1px 2px rgba(36, 48, 40, 0.04)',
        zIndex: isActive ? 20 : 1,
      }}
      transition={{
        duration: 0.48,
        delay: cascadeDelay(index, activeIndex),
        ease: EASE,
      }}
      onMouseEnter={() => onActivate(index)}
      onFocus={() => onActivate(index)}
      onMouseMove={onMove}
      onMouseLeave={resetTilt}
    >
      <motion.div
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-brand"
        animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.42, delay: cascadeDelay(index, activeIndex), ease: EASE }}
      />

      <motion.span
        className="pointer-events-none absolute -right-1 -top-2 font-gs text-[3.5rem] leading-none text-brand/10 select-none md:text-[4.5rem]"
        animate={{
          scale: isActive ? 1.1 : 1,
          opacity: isActive ? 0.22 : 0.1,
        }}
        transition={{ duration: 0.45, ease: EASE }}
        aria-hidden
      >
        {String(index + 1).padStart(2, '0')}
      </motion.span>

      <div className="relative flex items-start justify-between gap-3">
        <motion.span
          className="text-caption font-bold tracking-[0.2em] text-brand"
          animate={{ x: isActive ? 4 : 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          0{index + 1}
        </motion.span>
        <motion.span
          className="rounded-full bg-brand-light px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand"
          animate={{
            scale: isActive ? 1.06 : 1,
            backgroundColor: isActive ? 'var(--color-brand)' : 'var(--color-brand-light)',
            color: isActive ? '#fff' : 'var(--color-brand)',
          }}
          transition={{ duration: 0.32, ease: EASE }}
        >
          Detalhes
        </motion.span>
      </div>

      <motion.h3
        className="text-archive-title relative mt-4 md:mt-5"
        animate={{ color: isActive ? 'var(--color-brand)' : 'var(--color-ink)' }}
        transition={{ duration: 0.28 }}
      >
        {service.title}
      </motion.h3>

      <motion.p
        className={`text-body relative mt-2 ${isActive ? '' : 'line-clamp-2 md:line-clamp-none'}`}
        animate={{ opacity: isActive ? 1 : 0.82 }}
      >
        {service.description}
      </motion.p>

      <ul className="relative mt-auto flex flex-wrap gap-1.5 pt-4">
        {service.features.map((feature, fi) => (
          <motion.li
            key={feature}
            className="rounded-full border border-border bg-brand-soft px-2.5 py-0.5 text-[10px] text-ink-muted"
            initial={false}
            animate={{
              opacity: isActive ? 1 : 0.7,
              y: isActive ? 0 : 3,
              x: isActive ? 0 : -6,
              borderColor: isActive ? 'var(--color-brand)' : 'var(--color-border)',
            }}
            transition={{
              duration: 0.38,
              delay: isActive ? fi * 0.06 + 0.08 : cascadeDelay(index, activeIndex) * 0.4,
              ease: EASE,
            }}
          >
            {feature}
          </motion.li>
        ))}
      </ul>

      <motion.span
        className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand"
        animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -8 }}
        transition={{ duration: 0.32, delay: isActive ? 0.18 : 0, ease: EASE }}
        aria-hidden={!isActive}
      >
        Pedir info
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </motion.span>
    </motion.a>
  )
}

function CarouselNavButton({
  direction,
  onClick,
  disabled,
}: {
  direction: 'prev' | 'next'
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Serviço anterior' : 'Serviço seguinte'}
      className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-white text-ink transition-[border-color,opacity] duration-300 ease-out hover:border-brand disabled:cursor-not-allowed disabled:opacity-35"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        aria-hidden
      >
        {direction === 'prev' ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
        )}
      </svg>
    </button>
  )
}

function useCardOffsets(
  viewportRef: React.RefObject<HTMLDivElement | null>,
  trackRef: React.RefObject<HTMLDivElement | null>,
) {
  const [offsets, setOffsets] = useState<number[]>([0])

  const measure = useCallback(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    const cards = track.querySelectorAll<HTMLElement>(CARD_SELECTOR)
    if (!cards.length) return

    const viewportWidth = viewport.clientWidth
    const maxScroll = Math.max(0, track.scrollWidth - viewportWidth)
    const next = Array.from(cards).map((card) =>
      Math.min(Math.max(0, card.offsetLeft), maxScroll),
    )

    setOffsets(next)
  }, [viewportRef, trackRef])

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)

    const viewport = viewportRef.current
    let observer: ResizeObserver | undefined
    if (viewport && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(measure)
      observer.observe(viewport)
    }

    return () => {
      window.removeEventListener('resize', measure)
      observer?.disconnect()
    }
  }, [measure, viewportRef])

  return { offsets, remeasure: measure }
}

function ServicesScrollStage() {
  const containerRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const mouseX = useMotionValue(-400)
  const mouseY = useMotionValue(-400)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const progress = useTransform(scrollYProgress, easeProgress)
  const progressPercent = useTransform(progress, [0, 1], [0, 100])
  const progressWidth = useMotionTemplate`${progressPercent}%`
  const { offsets, remeasure } = useCardOffsets(viewportRef, trackRef)

  const trackX = useTransform(progress, (p) => {
    if (offsets.length <= 1) return 0
    const scaled = p * (offsets.length - 1)
    const base = Math.floor(scaled)
    const frac = scaled - base
    const from = offsets[base] ?? 0
    const to = offsets[Math.min(base + 1, offsets.length - 1)] ?? from
    return -(from + (to - from) * frac)
  })

  useMotionValueEvent(progress, 'change', (p) => {
    const idx = Math.min(
      services.length - 1,
      Math.max(0, Math.round(p * (services.length - 1))),
    )
    setFocusedIndex(idx)
    setHoverIndex(null)
  })

  useEffect(() => {
    remeasure()
  }, [remeasure, focusedIndex])

  const scrollToIndex = useCallback(
    (index: number) => {
      const container = containerRef.current
      if (!container) return

      const top = container.offsetTop
      const travel = container.offsetHeight - window.innerHeight
      const targetProgress = index / Math.max(services.length - 1, 1)
      const targetTop = top + targetProgress * travel

      animate(window.scrollY, targetTop, {
        duration: 0.65,
        ease: EASE,
        onUpdate: (v) => {
          window.scrollTo(0, v)
        },
      })
    },
    [],
  )

  const onStageMove = useCallback(
    (e: React.MouseEvent) => {
      if (!stageRef.current) return
      const rect = stageRef.current.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    },
    [mouseX, mouseY],
  )

  const onStageLeave = useCallback(() => {
    setHoverIndex(null)
    mouseX.set(-400)
    mouseY.set(-400)
  }, [mouseX, mouseY])

  const spotlight = useMotionTemplate`radial-gradient(480px circle at ${mouseX}px ${mouseY}px, rgba(128, 152, 112, 0.14), transparent 68%)`
  const activeIndex = hoverIndex ?? focusedIndex
  const focused = services[focusedIndex]

  return (
    <section
      ref={containerRef}
      id="servicos"
      className="relative bg-canvas"
      style={{ height: SCROLL_HEIGHT }}
      aria-label="Serviços"
    >
      <div className="sticky top-0 viewport-lock-min flex flex-col justify-center bg-canvas py-16 md:py-20">
        <div className="section-pad mx-auto w-full max-w-6xl">
          <SectionLabel>Arquivo · Serviços</SectionLabel>
          <h2 className="text-heading">Tudo o que cuidamos.</h2>
          <p className="text-body-lg mt-3 max-w-xl">
            Continue a scroll — cada serviço abre em cascata.
          </p>

          <div
            ref={stageRef}
            className="relative mt-8"
            onMouseMove={onStageMove}
            onMouseLeave={onStageLeave}
          >
            <motion.div
              className="pointer-events-none absolute inset-0 z-0 rounded-3xl"
              style={{ background: spotlight }}
              aria-hidden
            />

            <div className="relative z-10 mb-5 flex items-end justify-between gap-4 border-b border-border pb-4">
              <div className="flex items-end gap-4">
                <motion.p
                  key={focusedIndex}
                  className="font-gs text-[clamp(2.5rem,10vw,3.75rem)] leading-none text-brand/25 tabular-nums"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  aria-hidden
                >
                  {String(focusedIndex + 1).padStart(2, '0')}
                </motion.p>
                <div className="min-w-0 pb-1">
                  <p className="text-caption text-ink-muted">Serviço ativo</p>
                  <motion.p
                    key={focused?.id}
                    className="font-display truncate text-sm font-semibold text-ink md:text-base"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    {focused?.title}
                  </motion.p>
                </div>
              </div>
              <p className="hidden text-caption text-ink-muted sm:block">
                {String(focusedIndex + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
              </p>
            </div>

            <div ref={viewportRef} className="relative z-10 overflow-hidden">
              <motion.div
                ref={trackRef}
                className="flex w-max gap-4 md:gap-5"
                style={{ x: trackX }}
              >
                {services.map((service, i) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    index={i}
                    activeIndex={activeIndex}
                    onActivate={setHoverIndex}
                  />
                ))}
              </motion.div>
            </div>

            <div className="relative z-10 mt-6 flex items-center gap-3 md:gap-4">
              <CarouselNavButton
                direction="prev"
                disabled={focusedIndex === 0}
                onClick={() => scrollToIndex(Math.max(0, focusedIndex - 1))}
              />

              <div className="relative h-px min-w-0 flex-1 bg-border">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-brand"
                  style={{ width: progressWidth }}
                />
                <div className="absolute inset-0 flex justify-between px-0.5">
                  {services.map((service, i) => (
                    <button
                      key={service.id}
                      type="button"
                      aria-label={`Ir para ${service.title}`}
                      aria-current={i === focusedIndex ? 'true' : undefined}
                      onClick={() => scrollToIndex(i)}
                      className="group relative -top-1.5 h-3 w-3 cursor-pointer"
                    >
                      <span
                        className={`absolute inset-0 rounded-full transition-[background-color,transform] duration-300 ${
                          i === focusedIndex
                            ? 'scale-125 bg-brand'
                            : 'bg-border group-hover:bg-brand/50'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <CarouselNavButton
                direction="next"
                disabled={focusedIndex === services.length - 1}
                onClick={() => scrollToIndex(Math.min(services.length - 1, focusedIndex + 1))}
              />
            </div>

            <p className="relative z-10 mt-4 flex items-center justify-center gap-2 text-[11px] text-ink-muted">
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M6 13l6 6 6-6" />
              </svg>
              Scroll para passar os serviços
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function ServicesStatic() {
  return (
    <section id="servicos" className="section-gap-compact bg-canvas">
      <div className="section-pad mx-auto max-w-6xl">
        <SectionLabel>Arquivo · Serviços</SectionLabel>
        <h2 className="text-heading">Tudo o que cuidamos.</h2>
        <div className="services-track mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {services.map((service, i) => (
            <a
              key={service.id}
              href={whatsappUrl(`Informações sobre ${service.title}`)}
              data-service-card
              className="flex w-[min(78vw,300px)] shrink-0 snap-start cursor-pointer flex-col rounded-2xl border border-border bg-white p-5 shadow-sm transition-colors hover:border-brand md:w-[340px] md:p-6"
            >
              <span className="text-caption font-bold text-brand">0{i + 1}</span>
              <h3 className="text-archive-title mt-4">{service.title}</h3>
              <p className="text-body mt-2 line-clamp-3">{service.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Services() {
  const reduced = useReducedMotion()
  if (reduced) return <ServicesStatic />
  return <ServicesScrollStage />
}
