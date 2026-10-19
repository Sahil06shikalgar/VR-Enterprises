import { useEffect, useRef } from 'react'

/**
 * CustomCursor - Pure Atelier Diamond Star
 * 
 * Features:
 * 1. Single iconic 4-point faceted diamond star cursor (no rectangle, no circle, no reticle).
 * 2. Instant-response tracking with luminous terracotta/gold core + white specular glint.
 * 3. Fluid glowing ribbon trail connecting recent positions with smooth bezier curves.
 * 4. Trailing stardust particles with warm radial gradients and twinkle sparks.
 * 5. Radiant supernova sparkle burst on click.
 * 6. Smooth 45° tilt and scale expansion when hovering links, buttons, and cards.
 * 7. Automatically hides over native text inputs for seamless editing.
 */
function CustomCursor() {
  const canvasRef = useRef(null)
  const coreRef = useRef(null)

  useEffect(() => {
    // Check if on a pure touch device (mobile phone / coarse pointer with no hover)
    if (typeof window === 'undefined') return
    const isTouchOnly =
      window.matchMedia &&
      window.matchMedia('(hover: none) and (pointer: coarse)').matches

    if (isTouchOnly) return

    const canvas = canvasRef.current
    const core = coreRef.current
    if (!canvas || !core) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // Cursor coordinates and physics state
    let mouseX = -200
    let mouseY = -200
    let isVisible = false
    let isClicking = false
    let isOverText = false
    let hoverType = null // null | 'link' | 'card'
    let rafId = null
    let isLoopRunning = false
    let lastEmitTime = 0

    // Fluid ribbon trail history buffer
    const ribbonHistory = []
    const MAX_RIBBON_POINTS = 14

    // Particle pool
    const particles = []
    const MAX_PARTICLES = 50

    // Rich brand palette (Terracotta, Gold, Amber, Sand)
    const PALETTE = [
      { r: 200, g: 110, b: 75 },  // Terracotta
      { r: 224, g: 148, b: 64 },  // Radiant Amber
      { r: 218, g: 165, b: 82 },  // Warm Gold
      { r: 238, g: 185, b: 120 }, // Soft Sun Glint
      { r: 180, g: 90,  b: 60 },  // Deep Amber
    ]

    const spawnParticle = (x, y, isBurst = false) => {
      if (particles.length >= MAX_PARTICLES) {
        particles.shift()
      }

      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)]
      const angle = Math.random() * Math.PI * 2
      const speed = isBurst ? Math.random() * 3.5 + 1.2 : Math.random() * 0.9 + 0.3

      particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (isBurst ? 0.3 : 0.4), // Gentle upward thermal drift
        size: isBurst ? Math.random() * 4.5 + 2.5 : Math.random() * 3.4 + 1.6,
        alpha: isBurst ? 0.95 : 0.82,
        decay: isBurst ? Math.random() * 0.028 + 0.016 : Math.random() * 0.024 + 0.016,
        color,
      })
    }

    const startLoop = () => {
      if (!isLoopRunning) {
        isLoopRunning = true
        rafId = requestAnimationFrame(tick)
      }
    }

    const tick = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Update pure star core position, scale, and subtle hover tilt
      if (core) {
        const starScale = isOverText
          ? 0
          : isClicking
          ? 0.78
          : hoverType === 'link' || hoverType === 'card'
          ? 1.42
          : 1

        const starRotation = hoverType === 'link' || hoverType === 'card' ? 45 : 0

        core.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) rotate(${starRotation}deg) scale(${starScale})`
        core.style.opacity = isVisible && !isOverText ? '1' : '0'

        if (hoverType) {
          core.setAttribute('data-hover', hoverType)
        } else {
          core.removeAttribute('data-hover')
        }
      }

      // 1. Draw Liquid Fluid Glowing Ribbon
      if (ribbonHistory.length > 2) {
        ctx.save()
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        for (let i = 0; i < ribbonHistory.length - 1; i++) {
          const ptA = ribbonHistory[i]
          const ptB = ribbonHistory[i + 1]
          const progress = i / ribbonHistory.length // 0 (oldest) to 1 (newest)
          const lineWidth = Math.max(progress * 4.2, 0.8)
          const alpha = (progress * 0.42).toFixed(3)

          ctx.beginPath()
          ctx.moveTo(ptA.x, ptA.y)
          ctx.lineTo(ptB.x, ptB.y)
          ctx.lineWidth = lineWidth
          ctx.strokeStyle = `rgba(200, 110, 75, ${alpha})`
          ctx.stroke()

          // Inner bright highlight core of the fluid ribbon
          ctx.beginPath()
          ctx.moveTo(ptA.x, ptA.y)
          ctx.lineTo(ptB.x, ptB.y)
          ctx.lineWidth = Math.max(lineWidth * 0.4, 0.5)
          ctx.strokeStyle = `rgba(245, 205, 140, ${(progress * 0.65).toFixed(3)})`
          ctx.stroke()
        }
        ctx.restore()
      }

      // Age and prune ribbon points
      for (let i = ribbonHistory.length - 1; i >= 0; i--) {
        ribbonHistory[i].age = (ribbonHistory[i].age || 0) + 1
        if (ribbonHistory[i].age > 16) {
          ribbonHistory.splice(i, 1)
        }
      }

      // 2. Draw Glowing Stardust Particles
      ctx.save()
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.98
        p.vy *= 0.98
        p.size *= 0.965
        p.alpha -= p.decay

        if (p.alpha <= 0.02 || p.size <= 0.3) {
          particles.splice(i, 1)
          continue
        }

        // Luminous radial glow halo around each dust particle
        const glowRadius = Math.max(p.size * 2.6, 2.5)
        const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius)
        radGrad.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha.toFixed(3)})`)
        radGrad.addColorStop(0.45, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${(p.alpha * 0.45).toFixed(3)})`)
        radGrad.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`)

        ctx.fillStyle = radGrad
        ctx.beginPath()
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2)
        ctx.fill()

        // Crisp star glint center
        ctx.fillStyle = `rgba(255, 255, 255, ${(p.alpha * 0.95).toFixed(3)})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, Math.max(p.size * 0.4, 0.7), 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

      // Determine whether loop should stay active
      if (particles.length > 0 || ribbonHistory.length > 0) {
        rafId = requestAnimationFrame(tick)
      } else {
        isLoopRunning = false
      }
    }

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      if (!isVisible) {
        isVisible = true
      }

      // Add to ribbon fluid trail
      ribbonHistory.push({ x: mouseX, y: mouseY, age: 0 })
      if (ribbonHistory.length > MAX_RIBBON_POINTS) {
        ribbonHistory.shift()
      }

      // Context detection for hover states
      const target = e.target
      if (target) {
        isOverText = !!target.closest('input, textarea, select')

        const cardEl = target.closest(
          '.portfolio-card, .folio-item, .service-card, .why-feature__card, .approach-card, .team-card, .blog-card, .video-card',
        )
        const linkEl = target.closest(
          'a, button, [role="button"], .folio-filter, .nav-link, .menu-toggle, .btn, .tab-btn',
        )

        if (cardEl) {
          hoverType = 'card'
        } else if (linkEl) {
          hoverType = 'link'
        } else {
          hoverType = null
        }
      }

      // Throttle particle emission slightly for fluid trailing density
      const now = performance.now()
      if (now - lastEmitTime > 20) {
        lastEmitTime = now
        spawnParticle(mouseX, mouseY, false)
        if (hoverType) {
          spawnParticle(mouseX, mouseY, false)
        }
      }

      startLoop()
    }

    const onMouseDown = () => {
      isClicking = true
      // Radiant supernova burst on click (14 sparkling particles)
      for (let i = 0; i < 14; i++) {
        spawnParticle(mouseX, mouseY, true)
      }
      startLoop()
    }

    const onMouseUp = () => {
      isClicking = false
      startLoop()
    }

    const onMouseLeave = () => {
      isVisible = false
      ribbonHistory.length = 0
      startLoop()
    }

    const onMouseEnter = (e) => {
      isVisible = true
      mouseX = e.clientX
      mouseY = e.clientY
      startLoop()
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousedown', onMouseDown, { passive: true })
    window.addEventListener('mouseup', onMouseUp, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      {/* Fluid Glowing Particle & Ribbon Canvas */}
      <canvas
        ref={canvasRef}
        className="custom-cursor__canvas"
        aria-hidden="true"
      />

      {/* Pure Atelier Diamond Star Cursor (No rectangle, seamless glowing star) */}
      <div
        ref={coreRef}
        className="custom-cursor__core"
        aria-hidden="true"
      />
    </>
  )
}

export default CustomCursor
