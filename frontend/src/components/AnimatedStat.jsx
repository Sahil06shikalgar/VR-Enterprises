import { useEffect, useRef, useState, useCallback } from 'react'
import { useReducedMotion } from 'motion/react'

function formatNumber(num, suffix) {
  if (suffix === '%') {
    return `${num.toLocaleString()}${suffix}`
  }
  if (suffix === '+') {
    return `${num.toLocaleString()}${suffix}`
  }
  return num.toLocaleString()
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

function AnimatedStat({ value, suffix, label, index = 0 }) {
  const reduce = useReducedMotion()
  const [count, setCount] = useState(reduce ? value : 0)
  const [isVisible, setIsVisible] = useState(reduce)
  const [isHovered, setIsHovered] = useState(false)
  const animationRef = useRef(null)
  const observerRef = useRef(null)
  const elementRef = useRef(null)
  const hasAnimated = useRef(false)
  const startTimeRef = useRef(0)

  const startCounter = useCallback(() => {
    const duration = 1800
    startTimeRef.current = performance.now()

    const animate = (currentTime) => {
      const elapsed = currentTime - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutCubic(progress)
      const currentValue = Math.floor(value * easedProgress)
      setCount(currentValue)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setCount(value)
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [value])

  useEffect(() => {
    if (reduce) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true
            setIsVisible(true)
            startCounter()
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )

    observerRef.current = observer
    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [value, reduce, startCounter])

  const staggerDelay = index * 100

  return (
    <div
      ref={elementRef}
      className="stat-card"
      data-visible={isVisible}
      data-hovered={isHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transitionDelay: reduce ? '0ms' : `${staggerDelay}ms`,
      }}
    >
      <strong aria-hidden={!reduce} style={{ transform: reduce ? 'none' : `scale(${isVisible ? 1 : 0.96})` }}>
        {formatNumber(count, suffix)}
      </strong>
      <span>{label}</span>
      <div className="stat-card__accent" aria-hidden="true" />
    </div>
  )
}

export default AnimatedStat