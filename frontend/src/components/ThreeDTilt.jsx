import { useRef, useCallback } from 'react'

/**
 * ThreeDTilt - Gives any element high-performance 3D perspective tilt
 * with dynamic specular glare reflection following cursor position.
 * Uses direct DOM manipulation via requestAnimationFrame for zero-lag 60fps performance.
 */
function ThreeDTilt({
  children,
  className = '',
  maxTilt = 12,
  perspective = 1000,
  scale = 1.02,
  glare = true,
  style: propStyle = {},
}) {
  const cardRef = useRef(null)
  const glareRef = useRef(null)
  const rafId = useRef(null)

  const handleMouseMove = useCallback(
    (e) => {
      if (!cardRef.current) return
      if (rafId.current) cancelAnimationFrame(rafId.current)

      rafId.current = requestAnimationFrame(() => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = ((y - centerY) / centerY) * -maxTilt
        const rotateY = ((x - centerX) / centerX) * maxTilt

        cardRef.current.style.transform = `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
        cardRef.current.style.transition = 'transform 0.08s ease-out'

        if (glare && glareRef.current) {
          const glareX = (x / rect.width) * 100
          const glareY = (y / rect.height) * 100
          glareRef.current.style.opacity = '0.22'
          glareRef.current.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0) 65%)`
          glareRef.current.style.transition = 'opacity 0.15s ease-out'
        }
      })
    },
    [maxTilt, perspective, scale, glare],
  )

  const handleMouseLeave = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current)
    if (cardRef.current) {
      cardRef.current.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
      cardRef.current.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
    }
    if (glare && glareRef.current) {
      glareRef.current.style.opacity = '0'
      glareRef.current.style.transition = 'opacity 0.35s ease-out'
    }
  }, [perspective, glare])

  return (
    <div
      ref={cardRef}
      className={`three-d-tilt-root ${className}`}
      style={{
        ...propStyle,
        transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
        transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
        position: 'relative',
        willChange: 'transform',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          className="three-d-glare"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            zIndex: 10,
            mixBlendMode: 'overlay',
            opacity: 0,
            background: 'none',
            transition: 'opacity 0.35s ease-out',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export default ThreeDTilt
