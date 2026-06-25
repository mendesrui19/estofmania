import { HERO_VIDEO_SRC, CRITICAL_IMAGES } from './assets'

export type PreloadPhase = 'fonts' | 'video' | 'images' | 'final'

export type PreloadProgress = {
  ratio: number
  phase: PreloadPhase
  label: string
}

const PHASE_LABELS: Record<PreloadPhase, string> = {
  fonts: 'A preparar tipografia…',
  video: 'A carregar vídeo cinematográfico…',
  images: 'A preparar galeria e serviços…',
  final: 'Quase pronto…',
}

const MAX_WAIT_MS = 45_000

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    const finish = () => resolve()
    img.onload = finish
    img.onerror = finish
    img.src = src
  })
}

function preloadVideo(src: string): Promise<void> {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.preload = 'auto'
    video.muted = true
    video.playsInline = true

    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      video.src = ''
      video.load()
      resolve()
    }

    video.addEventListener('canplaythrough', finish, { once: true })
    video.addEventListener('loadeddata', () => {
      if (video.readyState >= 3) finish()
    })
    video.addEventListener('error', finish, { once: true })

    video.src = src
    video.load()
  })
}

function waitForWindowLoad(): Promise<void> {
  if (document.readyState === 'complete') return Promise.resolve()
  return new Promise((resolve) => {
    window.addEventListener('load', () => resolve(), { once: true })
  })
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error('timeout')), ms)
    }),
  ])
}

export type PreloadOptions = {
  includeVideo?: boolean
  onProgress?: (progress: PreloadProgress) => void
}

/**
 * Garante fonts, vídeo hero, imagens críticas e window.load antes de revelar o site.
 */
let cachedPreload: Promise<void> | null = null
let cachedKey = ''

export async function preloadSite(options: PreloadOptions = {}): Promise<void> {
  const key = `${options.includeVideo !== false}`
  if (cachedPreload && cachedKey === key) return cachedPreload
  cachedKey = key
  cachedPreload = preloadSiteInternal(options)
  return cachedPreload
}

async function preloadSiteInternal({
  includeVideo = true,
  onProgress,
}: PreloadOptions = {}): Promise<void> {
  const images = [...CRITICAL_IMAGES]
  const weights = includeVideo
    ? { fonts: 0.08, video: 0.42, images: 0.42, final: 0.08 }
    : { fonts: 0.15, video: 0, images: 0.77, final: 0.08 }

  let done = 0
  const report = (phase: PreloadPhase, localRatio: number) => {
    const phaseStart =
      phase === 'fonts'
        ? 0
        : phase === 'video'
          ? weights.fonts
          : phase === 'images'
            ? weights.fonts + weights.video
            : weights.fonts + weights.video + weights.images

    const phaseWeight =
      phase === 'fonts'
        ? weights.fonts
        : phase === 'video'
          ? weights.video
          : phase === 'images'
            ? weights.images
            : weights.final

    const ratio = Math.min(phaseStart + localRatio * phaseWeight, 0.995)
    onProgress?.({ ratio, phase, label: PHASE_LABELS[phase] })
    return ratio
  }

  onProgress?.({ ratio: 0, phase: 'fonts', label: PHASE_LABELS.fonts })

  try {
    await withTimeout(document.fonts.ready, MAX_WAIT_MS)
  } catch {
    /* continua — fonts podem falhar em browsers antigos */
  }
  report('fonts', 1)

  if (includeVideo) {
    onProgress?.({ ratio: weights.fonts, phase: 'video', label: PHASE_LABELS.video })
    try {
      await withTimeout(preloadVideo(HERO_VIDEO_SRC), MAX_WAIT_MS)
    } catch {
      /* timeout — revela lo lo lo mesmo assim após final */
    }
    report('video', 1)
  }

  onProgress?.({
    ratio: weights.fonts + weights.video,
    phase: 'images',
    label: PHASE_LABELS.images,
  })

  const imageStep = 1 / Math.max(images.length, 1)
  for (let i = 0; i < images.length; i++) {
    await preloadImage(images[i]!)
    done = i + 1
    report('images', done * imageStep)
  }

  onProgress?.({
    ratio: weights.fonts + weights.video + weights.images,
    phase: 'final',
    label: PHASE_LABELS.final,
  })

  await waitForWindowLoad()
  await new Promise((r) => setTimeout(r, 280))

  onProgress?.({ ratio: 1, phase: 'final', label: 'Pronto.' })
}
