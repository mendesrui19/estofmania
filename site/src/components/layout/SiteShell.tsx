import { motion, useReducedMotion } from 'motion/react'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { preloadSite, type PreloadProgress } from '../../lib/preload'
import { isTouchDevice } from '../../lib/device'
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

const FORCE_READY_MS = isTouchDevice() ? 14_000 : 22_000

function lockBodyScroll() {
  const y = window.scrollY
  document.body.dataset.scrollLock = String(y)
  document.body.style.position = 'fixed'
  document.body.style.top = `-${y}px`
  document.body.style.left = '0'
  document.body.style.right = '0'
  document.body.style.width = '100%'
}

function unlockBodyScroll() {
  const y = Number(document.body.dataset.scrollLock ?? '0')
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.left = ''
  document.body.style.right = ''
  document.body.style.width = ''
  delete document.body.dataset.scrollLock
  window.scrollTo(0, y)
}

export function SiteShell({ children, includeVideo = true }: SiteShellProps) {
  const reduced = useReducedMotion()
  const [progress, setProgress] = useState<PreloadProgress>(INITIAL_PROGRESS)
  const [phase, setPhase] = useState<'loading' | 'exiting' | 'ready'>('loading')
  const revealedRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    revealedRef.current = false

    const reveal = () => {
      if (cancelled || revealedRef.current) return
      revealedRef.current = true

      if (reduced) {
        setPhase('ready')
        unlockBodyScroll()
        return
      }
      setPhase('exiting')
      window.setTimeout(() => {
        if (!cancelled) {
          setPhase('ready')
          unlockBodyScroll()
        }
      }, 920)
    }

    lockBodyScroll()

    const forceTimer = window.setTimeout(reveal, FORCE_READY_MS)

    preloadSite({
      includeVideo,
      onProgress: (p) => {
        if (!cancelled) setProgress(p)
      },
    })
      .then(reveal)
      .catch(reveal)

    return () => {
      cancelled = true
      clearTimeout(forceTimer)
      unlockBodyScroll()
    }
  }, [includeVideo, reduced])

  const showLoader = phase !== 'ready'

  return (
    <>
      {showLoader && (
        <SiteLoader progress={progress} exiting={phase === 'exiting'} />
      )}
      <div
        className="min-w-0 w-full"
        {...(showLoader ? { inert: true as const, 'aria-hidden': true as const } : {})}
      >
        <motion.div
          initial={false}
          animate={{
            opacity: phase === 'ready' ? 1 : 0,
            pointerEvents: phase === 'ready' ? 'auto' : 'none',
          }}
          transition={{ duration: reduced ? 0.2 : 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </div>
    </>
  )
}
