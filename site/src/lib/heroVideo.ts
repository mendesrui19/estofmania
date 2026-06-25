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

type ScrubState = {
  raf: number | null
  pending: number | null
  lastApplied: number
  seekListener: (() => void) | null
}

const scrubStates = new WeakMap<HTMLVideoElement, ScrubState>()

function getScrubState(video: HTMLVideoElement): ScrubState {
  let state = scrubStates.get(video)
  if (!state) {
    state = { raf: null, pending: null, lastApplied: -1, seekListener: null }
    scrubStates.set(video, state)
  }
  return state
}

function applyVideoSeek(video: HTMLVideoElement, state: ScrubState): void {
  state.raf = null

  const target = state.pending
  if (target === null) return

  if (video.seeking) {
    if (!state.seekListener) {
      const onSeeked = () => {
        state.seekListener = null
        if (state.pending !== null) {
          state.raf = requestAnimationFrame(() => applyVideoSeek(video, state))
        }
      }
      state.seekListener = onSeeked
      video.addEventListener('seeked', onSeeked, { once: true })
    }
    return
  }

  state.pending = null

  if (Math.abs(state.lastApplied - target) <= 0.02) return

  state.lastApplied = target
  video.currentTime = target
}

/**
 * Scrub suave em ambas as direcções — sem fastSeek (quebra ao voltar atrás no Safari).
 * Agrupa seeks por frame e espera seeked antes do próximo salto.
 */
export function seekVideoToProgress(video: HTMLVideoElement, progress: number): void {
  const duration = video.duration
  if (!duration || Number.isNaN(duration)) return

  const target = Math.min(Math.max(progress * duration, 0), Math.max(duration - 0.05, 0))
  const state = getScrubState(video)
  state.pending = target

  if (state.raf === null) {
    state.raf = requestAnimationFrame(() => applyVideoSeek(video, state))
  }
}

export function resetVideoScrubState(video: HTMLVideoElement): void {
  const state = scrubStates.get(video)
  if (!state) return
  if (state.raf !== null) cancelAnimationFrame(state.raf)
  if (state.seekListener) video.removeEventListener('seeked', state.seekListener)
  scrubStates.delete(video)
}
