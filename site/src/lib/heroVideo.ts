export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(pointer: coarse)').matches
}

export function waitVideoMetadata(video: HTMLVideoElement): Promise<void> {
  if (video.readyState >= 1 && video.duration && !Number.isNaN(video.duration)) {
    return Promise.resolve()
  }
  return new Promise((resolve) => {
    const done = () => resolve()
    video.addEventListener('loadedmetadata', done, { once: true })
    video.addEventListener('error', done, { once: true })
  })
}

/** iOS/Safari só pinta frames após o decoder ser activado com play(). */
export async function primeVideoForScroll(video: HTMLVideoElement): Promise<void> {
  video.muted = true
  video.defaultMuted = true
  video.playsInline = true
  video.setAttribute('playsinline', '')
  video.setAttribute('webkit-playsinline', 'true')

  await waitVideoMetadata(video)

  try {
    await video.play()
    video.pause()
    if (video.currentTime === 0) video.currentTime = 0.001
  } catch {
    /* autoplay bloqueado — desbloqueia no primeiro toque */
  }
}

export function seekVideoToProgress(video: HTMLVideoElement, progress: number): void {
  const duration = video.duration
  if (!duration || Number.isNaN(duration)) return

  const target = Math.min(Math.max(progress * duration, 0), duration - 0.04)
  if (Math.abs(video.currentTime - target) <= 0.035) return

  if ('fastSeek' in video && typeof video.fastSeek === 'function') {
    try {
      video.fastSeek(target)
      return
    } catch {
      /* fallback abaixo */
    }
  }

  video.currentTime = target
}
