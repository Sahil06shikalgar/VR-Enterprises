import { useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scrollToTop } from './useLenis.js'

/**
 * usePageTransition
 * 
 * Ensures that whenever a user navigates to any page from the navbar or links,
 * the viewport ALWAYS opens at the very top (0, 0), cleans up dead scroll triggers,
 * and refreshes animations.
 */
export function usePageTransition() {
  const location = useLocation()
  const previousPathRef = useRef(location.pathname)

  useLayoutEffect(() => {
    if (location.pathname !== previousPathRef.current) {
      previousPathRef.current = location.pathname

      // 1. Immediately reset scroll position to top (0, 0)
      scrollToTop(true)

      // 2. Kill outdated ScrollTriggers
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.onLeave) {
          trigger.kill()
        }
      })

      // 3. Confirm top alignment and refresh on next tick
      requestAnimationFrame(() => {
        scrollToTop(true)
        ScrollTrigger.refresh()
      })
    }
  }, [location.pathname])
}