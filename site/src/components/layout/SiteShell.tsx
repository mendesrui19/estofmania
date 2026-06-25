import { useReducedMotion } from 'motion/react'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { preloadSite, type PreloadProgress } from '../../lib/preload'
import { SiteLoader } from '../ui/SiteLoader'

type SiteShellProps = {
  children: ReactNode
  includeVideo?: boolean
}

const INITIAL_PROGRESS: PreloadProgress = {
  ratio: 0,
  phase: 'fonts',
  label: 'A preparar tipografia…',
}

export function SiteShell({ children, includeVideo = true }: SiteShellProps) {
  const reduced = useReducedMotion()
  const [progress, setProgress] = useState<PreloadProgress>(INITIAL_PROGRESS)
  const [phase, setPhase] = useState<'loading' | 'exiting' | 'ready'>('loading')
  const doneRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    let exitTimer: ReturnType<typeof setTimeout> | undefined
    doneRef.current = false

    const finish = () => {
      if (cancelled || doneRef.current) return
      doneRef.current = true

      if (reduced) {
        setPhase('ready')
        return
      }

      setPhase('exiting')
      exitTimer = window.setTimeout(() => {
        if (!cancelled) setPhase('ready')
      }, 650)
    }

    const forceTimer = window.setTimeout(finish, 8_000)

    preloadSite({
      includeVideo,
      onProgress: (p) => {
        if (!cancelled) setProgress(p)
      },
    })
      .then(finish)
      .catch(finish)

    return () => {
      cancelled = true
      clearTimeout(forceTimer)
      if (exitTimer) clearTimeout(exitTimer)
    }
  }, [includeVideo, reduced])

  const showLoader = phase !== 'ready'

  return (
    <>
      {children}
      {showLoader && (
        <SiteLoader progress={progress} exiting={phase === 'exiting'} />
      )}
    </>
  )
}
