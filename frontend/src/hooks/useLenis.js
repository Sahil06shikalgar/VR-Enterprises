import { useLayoutEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let activeLenis = null

export function useLenis() {
  const lenisRef = useRef(null)

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      return
    }

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
      gestureOrientation: 'vertical',
      smoothTouch: false,
      autoRaf: false,
    })

    lenisRef.current = lenis
    activeLenis = lenis

    if (typeof window !== 'undefined') {
      window.__lenis = lenis
    }

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.off('scroll', ScrollTrigger.update)
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000)
      })
      lenis.destroy()
      lenisRef.current = null
      activeLenis = null
      if (typeof window !== 'undefined') {
        window.__lenis = null
      }
    }
  }, [])

  return lenisRef
}

/**
 * Universal scrollToTop helper that synchronizes Lenis smooth-scroller,
 * native window scroll, documentElement, and body so page transitions
 * ALWAYS open at the very top (0, 0).
 */
export function scrollToTop(immediate = true) {
  if (activeLenis) {
    try {
      activeLenis.scrollTo(0, { immediate })
    } catch {
      // fallback
    }
  }

  if (typeof window !== 'undefined') {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: immediate ? 'instant' : 'smooth',
    })
    if (document.documentElement) {
      document.documentElement.scrollTop = 0
    }
    if (document.body) {
      document.body.scrollTop = 0
    }
  }
}

export function scrollTo(target, options = {}) {
  if (activeLenis) {
    activeLenis.scrollTo(target, options)
  } else if (typeof window !== 'undefined') {
    window.scrollTo(options)
  }
}