import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { company } from '../../data/content'
import {
  isTouchDevice,
  primeVideoForScroll,
  resetVideoScrubState,
  seekVideoToProgress,
} from '../../lib/heroVideo'
import { adoptHeroVideoElement, getHeroVideoSrc, releaseHeroVideoElement } from '../../lib/preload'
import { whatsappUrl } from '../../lib/utils'

/** Matches the studio cyclorama in the source MP4 — do not colorkey (sofa is same grey). */
const VIDEO_STUDIO = '#A8A8A8'
const SCROLL_HEIGHT = '1400svh'

type Range = readonly [number, number]
type BeatSide = 'left' | 'right'
type BeatTier = 'high' | 'mid' | 'low'
type BeatAnim = 'slide' | 'rise' | 'blur' | 'clip'

type ScrollBeatData = {
  range: Range
  kicker: string
  title: string
  body: string
  side: BeatSide
  tier: BeatTier
  anim: BeatAnim
}

/** Headline ~0.16; último beat (orçamento) com janela longa */
const scrollBeats: ScrollBeatData[] = [
  {
    range: [0.11, 0.24],
    kicker: 'O que fazemos',
    title: 'Limpeza profissional\nde estofos em casa.',
    body: 'Higienizamos sofás, colchões, tapetes e cortinas com extratora profissional — manchas, odores e ácaros eliminados no local.',
    side: 'left',
    tier: 'mid',
    anim: 'slide',
  },
  {
    range: [0.26, 0.39],
    kicker: 'Sofás · Cadeiras',
    title: 'Sem manchas.\nSem odores.',
    body: 'Higienização profunda que devolve cor e frescura ao tecido. Ideal para famílias, pets e estofos de uso diário.',
    side: 'right',
    tier: 'high',
    anim: 'clip',
  },
  {
    range: [0.41, 0.54],
    kicker: 'Impermeabilização',
    title: 'Proteja o que\nmais usa.',
    body: 'Barreira invisível contra líquidos e sujidade. Menos manchas no dia a dia, estofado que dura mais.',
    side: 'left',
    tier: 'low',
    anim: 'rise',
  },
  {
    range: [0.56, 0.69],
    kicker: 'Tapetes · Colchões',
    title: 'Tudo o que\nabsorve pó.',
    body: 'Tapetes com recolha ao domicílio. Colchões higienizados para dormir com mais tranquilidade.',
    side: 'right',
    tier: 'mid',
    anim: 'blur',
  },
  {
    range: [0.71, 0.82],
    kicker: 'Cortinas · Empresas',
    title: 'Casa ou negócio\ncomo novo.',
    body: 'Cortinas lavadas e remontadas. Também atendemos gabinetes, clínicas e espaços comerciais.',
    side: 'left',
    tier: 'high',
    anim: 'clip',
  },
  {
    range: [0.84, 0.97],
    kicker: 'Estofmania · Famalicão',
    title: 'Orçamento grátis\nem 24 horas.',
    body: 'Envie fotos pelo WhatsApp. Atendemos Vila Nova de Famalicão, Lousado, Trofa e arredores.',
    side: 'right',
    tier: 'low',
    anim: 'slide',
  },
]

const tierPad: Record<BeatTier, string> = {
  high: '',
  mid: '',
  low: '',
}

const tierWidth: Record<BeatTier, string> = {
  high: 'max-w-lg md:max-w-xl',
  mid: 'max-w-md md:max-w-lg',
  low: 'max-w-md md:max-w-[30rem]',
}

const BEAT_ENTER = 0.02
const BEAT_EXIT = 0.02

function sceneOpacity(progress: MotionValue<number>, range: Range) {
  const [start, end] = range
  return useTransform(
    progress,
    [start, start + BEAT_ENTER, end - BEAT_EXIT, end],
    [0, 1, 1, 0],
  )
}

function sceneVisibility(opacity: MotionValue<number>) {
  return useTransform(opacity, (v) => (v > 0.01 ? 'visible' : 'hidden'))
}

function TitleLine({
  progress,
  range,
  line,
  index,
  side,
  anim,
}: {
  progress: MotionValue<number>
  range: Range
  line: string
  index: number
  side: BeatSide
  anim: BeatAnim
}) {
  const [start, end] = range
  const lineDelay = index * 0.012
  const lineStart = start + BEAT_ENTER * 0.25 + lineDelay
  const lineEnter = 0.028
  const lineEnd = end - BEAT_EXIT

  const opacity = useTransform(
    progress,
    [lineStart, lineStart + lineEnter, lineEnd - lineEnter, lineEnd],
    [0, 1, 1, 0],
  )

  const slideFrom = side === 'left' ? -32 - index * 6 : 32 + index * 6
  const slideOut = side === 'left' ? -20 : 20

  const x = useTransform(
    progress,
    [lineStart, lineStart + lineEnter, lineEnd - lineEnter, lineEnd],
    anim === 'slide' || anim === 'clip'
      ? [slideFrom, 0, 0, slideOut]
      : [0, 0, 0, 0],
  )
  const y = useTransform(
    progress,
    [lineStart, lineStart + lineEnter, lineEnd - lineEnter, lineEnd],
    anim === 'rise' ? [28 + index * 6, 0, 0, -12] : [14 + index * 3, 0, 0, -8],
  )
  const blur = useTransform(
    progress,
    [lineStart, lineStart + lineEnter, lineEnd - lineEnter, lineEnd],
    anim === 'blur' ? [10, 0, 0, 6] : [0, 0, 0, 0],
  )
  const clipPct = useTransform(
    progress,
    [lineStart, lineStart + lineEnter, lineEnd - lineEnter, lineEnd],
    anim === 'clip' ? [100, 0, 0, 100] : [0, 0, 0, 0],
  )
  const clipPath = useTransform(clipPct, (v) =>
    side === 'right'
      ? `inset(0 0 0 ${v}%)`
      : `inset(0 ${v}% 0 0)`,
  )
  const filter = useTransform(blur, (b) => (b > 0 ? `blur(${b}px)` : 'none'))

  const isAccent = index > 0

  return (
    <motion.span
      className={`hero-text-glow-strong block ${
        isAccent ? 'text-scroll-cinema-accent mt-1' : 'text-scroll-cinema'
      }`}
      style={{
        opacity,
        x,
        y,
        filter,
        clipPath: anim === 'clip' ? clipPath : undefined,
      }}
    >
      {line}
    </motion.span>
  )
}

function ScrollBeat({
  progress,
  range,
  kicker,
  title,
  body,
  side,
  tier,
  anim,
}: ScrollBeatData & { progress: MotionValue<number> }) {
  const [start, end] = range
  const blockOpacity = sceneOpacity(progress, range)
  const blockVisibility = sceneVisibility(blockOpacity)

  const fromX = side === 'left' ? -40 : 40
  const outX = side === 'left' ? -28 : 28

  const blockX = useTransform(
    progress,
    [start, start + BEAT_ENTER, end - BEAT_EXIT, end],
    anim === 'slide' ? [fromX, 0, 0, outX] : [0, 0, 0, 0],
  )
  const blockY = useTransform(
    progress,
    [start, start + BEAT_ENTER, end - BEAT_EXIT, end],
    anim === 'rise' ? [24, 0, 0, -14] : [0, 0, 0, 0],
  )

  const kickerOpacity = useTransform(
    progress,
    [start + BEAT_ENTER * 0.2, start + BEAT_ENTER * 0.85, end - BEAT_EXIT, end],
    [0, 1, 1, 0],
  )
  const accentScale = useTransform(
    progress,
    [start + BEAT_ENTER * 0.15, start + BEAT_ENTER * 0.9],
    [0, 1],
  )

  const bodyOpacity = useTransform(
    progress,
    [start + BEAT_ENTER * 0.55, start + BEAT_ENTER + 0.02, end - BEAT_EXIT, end],
    [0, 1, 1, 0],
  )
  const bodyY = useTransform(
    progress,
    [start + BEAT_ENTER * 0.55, start + BEAT_ENTER + 0.02, end - BEAT_EXIT, end],
    [16, 0, 0, -10],
  )

  const titleLines = title.split('\n')

  const sideVeilClass =
    side === 'left'
      ? 'bg-[radial-gradient(ellipse_70%_80%_at_28%_50%,rgba(16,9,4,0.78),transparent_68%)]'
      : 'bg-[radial-gradient(ellipse_70%_80%_at_72%_50%,rgba(16,9,4,0.78),transparent_68%)]'

  const beatColClass =
    side === 'left' ? 'hero-beat-left' : 'hero-beat-right'

  return (
    <motion.div
      className={`pointer-events-none absolute inset-0 z-20 flex items-center pb-[6.5rem] md:pb-[5rem] ${tierPad[tier]}`}
      style={{ opacity: blockOpacity, visibility: blockVisibility }}
      aria-hidden={undefined}
    >
      <motion.div
        className={`pointer-events-none absolute inset-0 z-0 ${sideVeilClass}`}
        aria-hidden
      />

      <div className="hero-stage relative z-10 grid w-full grid-cols-12 items-center">
        <motion.div
          className={`${beatColClass} ${tierWidth[tier]}`}
          style={{ x: blockX, y: blockY }}
        >
          <motion.div
            className={`mb-4 flex items-center gap-3 ${side === 'right' ? 'flex-row-reverse justify-center md:justify-end' : 'justify-center md:justify-start'}`}
            style={{ opacity: kickerOpacity }}
          >
            <motion.span
              className={`block h-px w-14 shrink-0 origin-left bg-gradient-to-r from-burnt-sienna to-burnt-sienna/25 ${
                side === 'right' ? 'origin-right bg-gradient-to-l' : ''
              }`}
              style={{ scaleX: accentScale }}
              aria-hidden
            />
            <span className="text-kicker-scroll hero-text-glow">{kicker}</span>
          </motion.div>

          <h2 className="overflow-hidden">
            {titleLines.map((line, i) => (
              <TitleLine
                key={`${line}-${i}`}
                progress={progress}
                range={range}
                line={line}
                index={i}
                side={side}
                anim={anim}
              />
            ))}
          </h2>

          <motion.p
            className={`hero-text-glow text-scroll-body mt-5 md:mt-6 ${
              side === 'right' ? 'ml-auto' : ''
            }`}
            style={{ opacity: bodyOpacity, y: bodyY }}
          >
            {body}
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  )
}

function OpeningHeadline({ progress }: { progress: MotionValue<number> }) {
  const scrollFade = useTransform(progress, [0, 0.08, 0.16], [1, 1, 0])
  const visibility = sceneVisibility(scrollFade)
  const y = useTransform(progress, [0.08, 0.16], [0, -20])
  const x = useTransform(progress, [0.08, 0.16], [0, -16])

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-[15] flex items-center pb-[6.5rem] md:pb-[5rem]"
      style={{ opacity: scrollFade, visibility, y, x }}
    >
      <div className="hero-stage grid w-full grid-cols-12 items-center pt-[4.25rem] md:pt-[4.75rem]">
        <div className="hero-beat-left">
        <motion.p
          className="text-kicker-cream flex items-center justify-center gap-3 md:justify-start"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="block h-px origin-left bg-gradient-to-r from-burnt-sienna to-burnt-sienna/30"
            initial={{ scaleX: 0, width: 48 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
          />
          Limpeza profissional de estofos
        </motion.p>

        <h1 className="hero-text-glow-strong mx-auto mt-7 max-w-[16ch] md:mx-0">
          <motion.span
            className="text-hero-cinema block text-warm-cream"
            initial={{ opacity: 0, y: 48, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.95, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            Estofos
          </motion.span>
          <motion.span
            className="text-hero-cinema-accent hero-accent-brand mt-1 block"
            initial={{ opacity: 0, y: 36, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.95, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            limpos como
          </motion.span>
          <motion.span
            className="text-hero-cinema block text-warm-cream"
            initial={{ opacity: 0, y: 48, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.95, delay: 0.56, ease: [0.22, 1, 0.36, 1] }}
          >
            novos.
          </motion.span>
        </h1>

        <motion.p
          className="hero-text-glow text-hero-lede mt-6 max-w-lg md:mt-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          Higienizamos e impermeabilizamos sofás, tapetes, colchões e cortinas — em
          Famalicão e arredores.
        </motion.p>

        <motion.p
          className="hero-text-glow mt-3 font-display text-[13px] font-semibold tracking-wide text-burnt-sienna"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.88 }}
        >
          Orçamento grátis · Resposta em 24h
        </motion.p>
        </div>
      </div>
    </motion.div>
  )
}

function easeProgress(p: number) {
  return p * p * (3 - 2 * p)
}

/** Texto avança mais devagar que o vídeo — mais tempo para ler */
function easeBeatProgress(p: number) {
  const smooth = p * p * (3 - 2 * p)
  return Math.pow(smooth, 1.14)
}

function ScrollPrompt({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.03, 0.08, 0.11], [0, 1, 1, 0])
  const y = useTransform(progress, [0, 0.08], [8, 0])

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 bottom-8 z-30 flex flex-col items-center gap-2"
      style={{ opacity, y }}
      aria-hidden
    >
      <span className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-warm-cream/70">
        Scroll para continuar
      </span>
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 text-warm-cream/70"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M6 13l6 6 6-6" />
      </svg>
    </motion.div>
  )
}

function VerticalLabel({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.15, 0.25, 0.88, 0.96], [0, 1, 1, 0])

  return (
    <motion.div
      className="pointer-events-none absolute right-4 top-1/2 z-20 hidden origin-center -translate-y-1/2 rotate-90 lg:block xl:right-6"
      style={{ opacity }}
      aria-hidden
    >
      <span className="font-display text-[11px] font-medium uppercase tracking-[0.18em] text-warm-cream/55">
        Estofmania · Higienização profissional
      </span>
    </motion.div>
  )
}

function GhostPill({
  href,
  children,
  accent = false,
}: {
  href: string
  children: ReactNode
  accent?: boolean
}) {
  return (
    <a
      href={href}
      className={`font-display inline-flex cursor-pointer items-center justify-center rounded-[22.5px] border px-7 py-2.5 text-[13px] font-medium transition-[border-color,opacity] duration-300 ease-out hover:opacity-80 ${
        accent
          ? 'border-burnt-sienna text-burnt-sienna'
          : 'border-warm-cream text-warm-cream hover:border-burnt-sienna'
      }`}
    >
      {children}
    </a>
  )
}

function VideoStage() {
  const videoSrc = getHeroVideoSrc()
  const containerRef = useRef<HTMLElement>(null)
  const videoHostRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const primedRef = useRef(false)
  const [touchDevice] = useState(isTouchDevice)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const progress = useTransform(scrollYProgress, easeProgress)
  const beatProgress = useTransform(scrollYProgress, easeBeatProgress)
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  const videoScale = useTransform(progress, [0, 1], [1.06, 1])
  const videoY = useTransform(progress, [0, 1], ['0%', '-2%'])
  const studioVeil = useTransform(progress, [0, 0.18, 0.45, 0.72, 1], [0, 0.12, 0.28, 0.45, 0.62])
  const ctaOpacity = useTransform(beatProgress, [0, 0.78, 0.94], [1, 1, 0])
  const textVeil = useTransform(progress, [0, 0.25, 0.55], [0.72, 0.55, 0.65])

  useEffect(() => {
    const host = videoHostRef.current
    if (!host) return

    const adopted = adoptHeroVideoElement()
    const video = adopted ?? document.createElement('video')
    const created = !adopted

    if (created) {
      video.src = videoSrc
      video.preload = 'auto'
    }

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', 'true')
    video.className =
      'hero-video-el h-full w-full object-cover object-[center_42%] [transform:translateZ(0)]'

    host.appendChild(video)
    videoRef.current = video

    const unlock = async () => {
      if (primedRef.current) return
      await primeVideoForScroll(video)
      primedRef.current = true
      seekVideoToProgress(video, progress.get())
    }

    void unlock()

    const onTouch = () => {
      void unlock()
    }
    window.addEventListener('touchstart', onTouch, { once: true, passive: true })

    return () => {
      window.removeEventListener('touchstart', onTouch)
      videoRef.current = null
      if (host.contains(video)) host.removeChild(video)
      if (created) {
        video.removeAttribute('src')
        video.load()
      } else {
        releaseHeroVideoElement(video)
      }
      resetVideoScrubState(video)
    }
  }, [progress, videoSrc])

  useMotionValueEvent(progress, 'change', (p) => {
    const video = videoRef.current
    if (!video) return
    seekVideoToProgress(video, p)
  })

  return (
    <section
      ref={containerRef}
      id="inicio"
      className="relative bg-studio-black"
      style={{ height: SCROLL_HEIGHT }}
    >
      <div
        className="hero-video-stage sticky top-0 h-[100svh] overflow-hidden"
        style={{ backgroundColor: VIDEO_STUDIO }}
      >
        <motion.div
          className="hero-video-layer absolute inset-0 z-[1]"
          style={touchDevice ? undefined : { scale: videoScale, y: videoY }}
        >
          <div ref={videoHostRef} className="h-full w-full" aria-hidden />
        </motion.div>

        {/* Flash pós-loader — reveal cinematográfico */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-[4] bg-studio-black"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.1, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        />

        <motion.div
          className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-studio-black/95 via-studio-black/55 to-studio-black/15"
          style={{ opacity: textVeil }}
          aria-hidden
        />
        <motion.div
          className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-studio-black/70 via-transparent to-studio-black/20"
          aria-hidden
        />
        <motion.div
          className="pointer-events-none absolute inset-0 z-[2] bg-studio-black"
          style={{ opacity: studioVeil }}
          aria-hidden
        />

        <OpeningHeadline progress={beatProgress} />

        {scrollBeats.map((beat) => (
          <ScrollBeat key={beat.kicker + beat.title} progress={beatProgress} {...beat} />
        ))}

        <VerticalLabel progress={beatProgress} />
        <ScrollPrompt progress={beatProgress} />

        <motion.div
          className="hero-stage absolute inset-x-0 bottom-0 z-20 border-t border-dashed border-cork-shadow pb-6 pt-4 md:pb-8 md:pt-5"
          style={{ opacity: ctaOpacity }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <p className="font-display text-[9px] uppercase tracking-wide text-grey-brown sm:text-[10px]">
              Resposta em 24h · Orçamento grátis
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <GhostPill href={whatsappUrl('Olá Estofmania! Quero orçamento grátis.')} accent>
                Pedir orçamento
              </GhostPill>
              <GhostPill href="/#servicos">Ver serviços</GhostPill>
            </div>
          </div>
          <div className="mt-4 h-px w-full bg-cork-shadow">
            <motion.div className="h-px bg-warm-cream" style={{ width: progressWidth }} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function StaticHero() {
  const videoSrc = getHeroVideoSrc()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    void primeVideoForScroll(video)
  }, [])

  return (
    <section
      id="inicio"
      className="relative overflow-hidden"
      style={{ backgroundColor: VIDEO_STUDIO }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        playsInline
        preload="auto"
        autoPlay
        loop
        className="hero-video-el aspect-video w-full object-cover object-[center_42%]"
      />
      <div className="section-pad py-12">
        <p className="text-kicker-cream">Limpeza profissional de estofos</p>
        <h1 className="mt-6">
          <span className="text-hero-cinema block text-warm-cream">Estofos</span>
          <span className="text-hero-cinema-accent hero-accent-brand mt-1 block">limpos como</span>
          <span className="text-hero-cinema block text-warm-cream">novos.</span>
        </h1>
        <p className="text-hero-lede mt-6 max-w-lg">{company.description}</p>
        <GhostPill href={whatsappUrl('Olá Estofmania! Quero orçamento grátis.')} accent>
          Pedir orçamento
        </GhostPill>
      </div>
    </section>
  )
}

export function VideoScrollHero() {
  const reduced = useReducedMotion()
  if (reduced) return <StaticHero />
  return <VideoStage />
}
