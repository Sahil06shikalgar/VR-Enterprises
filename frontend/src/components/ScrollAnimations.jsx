import { useLayoutEffect } from 'react'
import { useGSAP } from '../hooks/useGSAP.js'
import { useLenis } from '../hooks/useLenis.js'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

function ScrollAnimations() {
  const _lenis = useLenis()

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      gsap.set('[data-gsap-animate]', { opacity: 1, y: 0, scale: 1 })
      return
    }

    const animateElements = gsap.utils.toArray('[data-gsap-animate]')

    animateElements.forEach((el, index) => {
      const delay = parseFloat(el.dataset.gsapDelay) || 0
      const stagger = parseFloat(el.dataset.gsapStagger) || 0
      const duration = parseFloat(el.dataset.gsapDuration) || 0.8
      const y = parseFloat(el.dataset.gsapY) || 30
      const scale = parseFloat(el.dataset.gsapScale) || 1
      const trigger = el.dataset.gsapTrigger || el
      const start = el.dataset.gsapStart || 'top 85%'
      const once = el.dataset.gsapOnce !== 'false'

      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: y,
          scale: scale,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: duration,
          ease: 'power3.out',
          delay: delay + (index * stagger),
          scrollTrigger: {
            trigger: trigger,
            start: start,
            once: once,
            toggleActions: 'play none none reverse',
          },
        }
      )
    })

    const parallaxElements = gsap.utils.toArray('[data-gsap-parallax]')

    parallaxElements.forEach((el) => {
      const speed = parseFloat(el.dataset.gsapSpeed) || 0.15
      const direction = el.dataset.gsapDirection || 'vertical'

      gsap.to(el, {
        yPercent: direction === 'vertical' ? speed * 100 : 0,
        xPercent: direction === 'horizontal' ? speed * 100 : 0,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    })

    const imageRevealElements = gsap.utils.toArray('[data-gsap-image-reveal]')

    imageRevealElements.forEach((wrapper) => {
      const img = wrapper.querySelector('img') || wrapper.querySelector('[data-gsap-image]')
      if (!img) return

      const scale = parseFloat(wrapper.dataset.gsapScale) || 1.06
      const duration = parseFloat(wrapper.dataset.gsapDuration) || 1.2

      gsap.fromTo(
        img,
        { scale: scale },
        {
          scale: 1,
          duration: duration,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 85%',
            once: true,
          },
        }
      )
    })
  }, [])

  useLayoutEffect(() => {
    const handleLoad = () => {
      ScrollTrigger.refresh()
    }

    window.addEventListener('load', handleLoad)

    const images = document.querySelectorAll('img')
    images.forEach((img) => {
      if (!img.complete) {
        img.addEventListener('load', handleLoad, { once: true })
      }
    })

    return () => {
      window.removeEventListener('load', handleLoad)
    }
  }, [])

  return null
}

export default ScrollAnimations