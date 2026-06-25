import { motion, useReducedMotion } from 'motion/react'
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

/** Garante que o scroll nunca fica bloqueado após o loader. */
function restorePageScroll() {
  document.body.style.overflow = ''
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.left = ''
  document.body.style.right = ''
  document.body.style.width = ''
  delete document.body.dataset.scrollLock
}

export function SiteShell({ children, includeVideo = true }: SiteShellProps) {
  const reduced = useReducedMotion()
  const [progress, setProgress] = useState<PreloadProgress>(INITIAL_PROGRESS)
  const [phase, setPhase] = useState<'loading' | 'exiting' | 'ready'>('loading')
  const revealedRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    let exitTimer: ReturnType<typeof setTimeout> | undefined
    revealedRef.current = false

    const finish = () => {
      if (cancelled || revealedRef.current) return
      revealedRef.current = true
      restorePageScroll()

      if (reduced) {
        setPhase('ready')
        return
      }

      setPhase('exiting')
      exitTimer = window.setTimeout(() => {
        if (!cancelled) setPhase('ready')
      }, 920)
    }

    document.body.style.overflow = 'hidden'

    const forceTimer = window.setTimeout(finish, 12_000)

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
      restorePageScroll()
    }
  }, [includeVideo, reduced])

  return (
    <>
      {phase !== 'ready' && (
        <SiteLoader progress={progress} exiting={phase === 'exiting'} />
      )}
      {phase === 'ready' && (
        <motion.div
          className="min-w-0 w-full"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0.2 : 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      )}
    </>
  )
}
