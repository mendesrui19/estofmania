import { HERO_VIDEO_SRC, CRITICAL_IMAGES } from './assets'
import { isTouchDevice } from './device'

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

const DESKTOP_MAX_WAIT_MS = 45_000
const MOBILE_MAX_WAIT_MS = 5_000
const MOBILE_LOAD_EVENT_MS = 2_500
const DESKTOP_LOAD_EVENT_MS = 15_000

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
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')

    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      video.src = ''
      video.load()
      resolve()
    }

    const onReady = () => {
      if (video.readyState >= 2) finish()
    }

    video.addEventListener('canplaythrough', finish, { once: true })
    video.addEventListener('canplay', onReady)
    video.addEventListener('loadeddata', onReady)
    video.addEventListener('loadedmetadata', onReady)
    video.addEventListener('error', finish, { once: true })

    video.src = src
    video.load()
  })
}

function waitForWindowLoad(timeoutMs: number): Promise<void> {
  if (document.readyState === 'complete') return Promise.resolve()
  return new Promise((resolve) => {
    let done = false
    const finish = () => {
      if (done) return
      done = true
      resolve()
    }
    window.addEventListener('load', finish, { once: true })
    setTimeout(finish, timeoutMs)
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
 * Garante fonts, vídeo hero (desktop), imagens críticas antes de revelar o site.
 * Em telemóvel: preload curto — o vídeo do hero carrega in-place.
 */
let cachedPreload: Promise<void> | null = null
let cachedKey = ''

export async function preloadSite(options: PreloadOptions = {}): Promise<void> {
  const touch = isTouchDevice()
  const key = `${options.includeVideo !== false}-${touch}`
  if (cachedPreload && cachedKey === key) return cachedPreload
  cachedKey = key
  cachedPreload = preloadSiteInternal(options, touch)
  return cachedPreload
}

async function preloadSiteInternal(
  { includeVideo = true, onProgress }: PreloadOptions = {},
  touch: boolean,
): Promise<void> {
  const images = [...CRITICAL_IMAGES]
  const skipVideoPreload = touch
  const preloadVideoHero = includeVideo && !skipVideoPreload
  const maxWait = touch ? MOBILE_MAX_WAIT_MS : DESKTOP_MAX_WAIT_MS

  const weights = preloadVideoHero
    ? { fonts: 0.08, video: 0.42, images: 0.42, final: 0.08 }
    : { fonts: 0.12, video: 0, images: 0.8, final: 0.08 }

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
  }

  onProgress?.({ ratio: 0, phase: 'fonts', label: PHASE_LABELS.fonts })

  try {
    await withTimeout(document.fonts.ready, touch ? 4_000 : DESKTOP_MAX_WAIT_MS)
  } catch {
    /* continua */
  }
  report('fonts', 1)

  if (preloadVideoHero) {
    onProgress?.({ ratio: weights.fonts, phase: 'video', label: PHASE_LABELS.video })
    try {
      await withTimeout(preloadVideo(HERO_VIDEO_SRC), maxWait)
    } catch {
      /* timeout — hero carrega in-place */
    }
    report('video', 1)
  } else if (includeVideo && touch) {
    onProgress?.({ ratio: weights.fonts, phase: 'video', label: 'A preparar vídeo…' })
    report('video', 1)
  }

  onProgress?.({
    ratio: weights.fonts + weights.video,
    phase: 'images',
    label: PHASE_LABELS.images,
  })

  if (touch) {
    await Promise.all(images.map((src) => preloadImage(src)))
    report('images', 1)
  } else {
    const imageStep = 1 / Math.max(images.length, 1)
    for (let i = 0; i < images.length; i++) {
      await preloadImage(images[i]!)
      report('images', (i + 1) * imageStep)
    }
  }

  onProgress?.({
    ratio: weights.fonts + weights.video + weights.images,
    phase: 'final',
    label: PHASE_LABELS.final,
  })

  await waitForWindowLoad(touch ? MOBILE_LOAD_EVENT_MS : DESKTOP_LOAD_EVENT_MS)
  await new Promise((r) => setTimeout(r, touch ? 120 : 280))

  onProgress?.({ ratio: 1, phase: 'final', label: 'Pronto.' })
}
