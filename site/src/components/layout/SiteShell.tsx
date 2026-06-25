import { motion, useReducedMotion } from 'motion/react'
import { type ReactNode, useEffect, useState } from 'react'
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

  useEffect(() => {
    let cancelled = false

    document.body.style.overflow = 'hidden'

    preloadSite({ includeVideo, onProgress: (p) => {
      if (!cancelled) setProgress(p)
    } })
      .then(() => {
        if (cancelled) return
        if (reduced) {
          setPhase('ready')
          document.body.style.overflow = ''
          return
        }
        setPhase('exiting')
        window.setTimeout(() => {
          if (!cancelled) {
            setPhase('ready')
            document.body.style.overflow = ''
          }
        }, 920)
      })
      .catch(() => {
        if (!cancelled) {
          setPhase('ready')
          document.body.style.overflow = ''
        }
      })

    return () => {
      cancelled = true
      document.body.style.overflow = ''
    }
  }, [includeVideo, reduced])

  return (
    <>
      {phase !== 'ready' && (
        <SiteLoader progress={progress} exiting={phase === 'exiting'} />
      )}
      {phase === 'ready' && (
        <motion.div
          className="min-w-0 overflow-x-clip"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      )}
    </>
  )
}
