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

const MAX_WAIT_MS = 90_000

/** Blob URL do vídeo hero — partilhado entre loader e scroll hero. */
let heroVideoBlobUrl: string | null = null
let heroVideoReady = false
/** Elemento já aquecido no loader — reutilizado no hero (crítico no iOS). */
let heroVideoElement: HTMLVideoElement | null = null

/** URL pronta para o `<video>` do hero (blob após preload, senão fallback de rede). */
export function getHeroVideoSrc(): string {
  return heroVideoBlobUrl ?? HERO_VIDEO_SRC
}

export function isHeroVideoReady(): boolean {
  return heroVideoReady
}

/** Transfere o `<video>` pré-carregado para o hero (uma única vez). */
export function adoptHeroVideoElement(): HTMLVideoElement | null {
  const el = heroVideoElement
  heroVideoElement = null
  return el
}

/** Devolve o elemento ao pool (ex.: remount React StrictMode). */
export function releaseHeroVideoElement(video: HTMLVideoElement): void {
  if (!heroVideoElement) heroVideoElement = video
}

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

async function fetchHeroVideoBlob(
  src: string,
  onProgress?: (ratio: number) => void,
): Promise<string> {
  if (heroVideoBlobUrl) {
    onProgress?.(1)
    return heroVideoBlobUrl
  }

  const response = await fetch(src)
  if (!response.ok) throw new Error(`hero video fetch ${response.status}`)

  const contentLength = Number(response.headers.get('content-length')) || 0
  const body = response.body

  let blob: Blob

  if (!body || contentLength <= 0) {
    blob = await response.blob()
    onProgress?.(1)
  } else {
    const reader = body.getReader()
    const chunks: Uint8Array[] = []
    let received = 0

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
      received += value.length
      onProgress?.(Math.min(received / contentLength, 0.98))
    }

    blob = new Blob(chunks as BlobPart[], { type: response.headers.get('content-type') ?? 'video/mp4' })
    onProgress?.(1)
  }

  heroVideoBlobUrl = URL.createObjectURL(blob)
  return heroVideoBlobUrl
}

/**
 * Garante que o vídeo está descarregado e buffered até ao fim — essencial para scrub no scroll.
 */
function warmHeroVideo(blobUrl: string): Promise<void> {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.preload = 'auto'
    video.muted = true
    video.playsInline = true
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', 'true')

    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      heroVideoReady = true
      heroVideoElement = video
      resolve()
    }

    const finishAfterPrime = async () => {
      try {
        await video.play()
        video.pause()
        video.currentTime = 0
      } catch {
        /* iOS pode exigir toque — hero faz unlock depois */
      }
      finish()
    }

    const checkBuffered = () => {
      const duration = video.duration
      if (!duration || Number.isNaN(duration)) return
      if (video.buffered.length === 0) return
      const end = video.buffered.end(video.buffered.length - 1)
      if (end >= duration - 0.15) void finishAfterPrime()
    }

    video.addEventListener('loadedmetadata', checkBuffered, { once: true })
    video.addEventListener('progress', checkBuffered)
    video.addEventListener('canplaythrough', () => void finishAfterPrime(), { once: true })
    video.addEventListener('error', finish, { once: true })

    video.src = blobUrl
    video.load()
  })
}

async function preloadHeroVideo(
  src: string,
  onProgress?: (ratio: number) => void,
): Promise<void> {
  if (heroVideoReady && heroVideoBlobUrl) {
    onProgress?.(1)
    return
  }

  const blobUrl = await fetchHeroVideoBlob(src, (fetchRatio) => {
    onProgress?.(fetchRatio * 0.85)
  })

  await warmHeroVideo(blobUrl)
  onProgress?.(1)
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
 * Garante fonts, vídeo hero (100%), imagens críticas e window.load antes de revelar o site.
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
      await withTimeout(
        preloadHeroVideo(HERO_VIDEO_SRC, (local) => report('video', local)),
        MAX_WAIT_MS,
      )
    } catch {
      /* timeout — revela o site na mesma; hero usa URL de rede */
      heroVideoReady = false
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
