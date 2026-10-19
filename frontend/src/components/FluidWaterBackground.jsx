import { useEffect, useRef } from 'react'

/**
 * FluidWaterBackground
 * 
 * Renders an ambient, luxurious aquatic flow across the entire site background:
 * 1. Layered undulating water current ribbons with caustics and organic fluid harmonics.
 * 2. 160 suspended luminous water granules/particles that drift along the fluid vector field.
 * 3. Interactive fluid ripples on mouse movement (gentle wake and vortex stirring).
 * 4. Responsive scroll surge creating organic aquatic depth.
 * 5. High-performance HTML5 Canvas (60fps, low CPU, DPI-aware, auto-pauses when tab inactive).
 */
function FluidWaterBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId = null
    let isRunning = true
    let width = 0
    let height = 0
    let dpr = 1

    // Resize handler with retina DPI scaling (capped at 1.5 for optimal 60fps)
    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    // Interaction State
    let mouseX = width * 0.5
    let mouseY = height * 0.4
    let targetMouseX = mouseX
    let targetMouseY = mouseY
    let mouseSpeed = 0
    let lastMouseX = mouseX
    let lastMouseY = mouseY

    let lastScrollY = window.scrollY || 0
    let scrollSurge = 0

    const onMouseMove = (e) => {
      targetMouseX = e.clientX
      targetMouseY = e.clientY
      const dx = targetMouseX - lastMouseX
      const dy = targetMouseY - lastMouseY
      mouseSpeed = Math.min(Math.hypot(dx, dy) * 0.08, 3.5)
      lastMouseX = targetMouseX
      lastMouseY = targetMouseY
    }

    const onScroll = () => {
      const currentScrollY = window.scrollY || 0
      const delta = currentScrollY - lastScrollY
      scrollSurge = Math.max(-4, Math.min(4, delta * 0.04))
      lastScrollY = currentScrollY
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    // Granule / Particle System
    const PARTICLE_COUNT = 150
    const particles = []

    // Curated Liquid Silver, Platinum & Specular Chrome Palette
    const GRANULE_COLORS = [
      { r: 215, g: 224, b: 236 }, // Sterling Silver
      { r: 235, g: 240, b: 248 }, // Polished Platinum Silver
      { r: 185, g: 195, b: 208 }, // Brushed Metallic Silver
      { r: 248, g: 251, b: 255 }, // Luminous Specular Silver Glint
      { r: 198, g: 208, b: 220 }, // Frosted Silver Mineral
      { r: 170, g: 182, b: 196 }, // Liquid Pewter Silver
    ]

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const size = Math.random() * 2.8 + 1.2
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        baseSpeed: Math.random() * 0.75 + 0.35,
        size,
        alpha: Math.random() * 0.45 + 0.3,
        pulseSpeed: Math.random() * 0.025 + 0.012,
        pulsePhase: Math.random() * Math.PI * 2,
        color: GRANULE_COLORS[Math.floor(Math.random() * GRANULE_COLORS.length)],
        hasSparkle: Math.random() < 0.3,
        sineOffset: Math.random() * Math.PI * 2,
      })
    }

    let time = 0

    // Animation Loop
    const render = () => {
      if (!isRunning) return

      time += 0.012

      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.06
      mouseY += (targetMouseY - mouseY) * 0.06
      mouseSpeed *= 0.94
      scrollSurge *= 0.92

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // 1. Draw Organic Fluid Water Currents (Multi-layered Sinusoidal Caustic Ribbons in Silver Tones)
      drawWaterCurrent(
        ctx,
        width,
        height,
        time * 0.8,
        0.28,
        55,
        'rgba(195, 205, 218, 0.045)',
        'rgba(228, 234, 244, 0.04)',
        mouseX,
        mouseY
      )

      drawWaterCurrent(
        ctx,
        width,
        height,
        time * 1.1 + 2.5,
        0.58,
        70,
        'rgba(215, 222, 232, 0.042)',
        'rgba(180, 190, 202, 0.032)',
        mouseX,
        mouseY
      )

      drawWaterCurrent(
        ctx,
        width,
        height,
        time * 0.65 + 5.0,
        0.82,
        48,
        'rgba(200, 210, 222, 0.038)',
        'rgba(245, 248, 252, 0.065)',
        mouseX,
        mouseY
      )

      // 2. Update & Draw Flowing Water Granules
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Water flow vector field calculation (curling aquatic stream)
        const flowAngle =
          Math.sin(p.y * 0.0025 + time * 0.7 + p.sineOffset) * 0.75 +
          Math.cos(p.x * 0.002 + time * 0.5) * 0.45 +
          0.35 // General gentle diagonal drift (top-left to bottom-right)

        let targetVx = Math.cos(flowAngle) * p.baseSpeed
        let targetVy = Math.sin(flowAngle) * p.baseSpeed + scrollSurge * 0.6

        // Interactive mouse stirring / vortex ripple
        const dx = p.x - mouseX
        const dy = p.y - mouseY
        const dist = Math.hypot(dx, dy)
        const maxDist = 180 + mouseSpeed * 30

        if (dist < maxDist && dist > 1) {
          const repelForce = (1 - dist / maxDist) * (1.8 + mouseSpeed)
          // Swirling tangent vortex + outward ripple
          targetVx += (dx / dist) * repelForce + (-dy / dist) * repelForce * 0.8
          targetVy += (dy / dist) * repelForce + (dx / dist) * repelForce * 0.8
        }

        // Apply velocity smoothly
        p.vx += (targetVx - p.vx) * 0.08
        p.vy += (targetVy - p.vy) * 0.08

        p.x += p.vx
        p.y += p.vy

        // Wrap around screen boundaries seamlessly
        if (p.x < -30) p.x = width + 20
        else if (p.x > width + 30) p.x = -20

        if (p.y < -30) p.y = height + 20
        else if (p.y > height + 30) p.y = -20

        // Glistening pulse
        const currentAlpha = Math.max(
          0.05,
          p.alpha + Math.sin(time * 3 + p.pulsePhase) * 0.12
        )

        // Draw glistening metallic silver granule halo
        const glowRadius = Math.max(p.size * 2.6, 2.5)
        const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius)
        radGrad.addColorStop(
          0,
          `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha.toFixed(3)})`
        )
        radGrad.addColorStop(
          0.45,
          `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${(currentAlpha * 0.45).toFixed(3)})`
        )
        radGrad.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`)

        ctx.fillStyle = radGrad
        ctx.beginPath()
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2)
        ctx.fill()

        // Crisp luminous silver specular core
        ctx.fillStyle = `rgba(255, 255, 255, ${(currentAlpha * 0.95).toFixed(3)})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, Math.max(p.size * 0.45, 0.7), 0, Math.PI * 2)
        ctx.fill()

        // 4-point diamond silver sparkle flare on glistening granules
        if (p.hasSparkle && currentAlpha > 0.32) {
          const sparkleLen = p.size * (1.8 + Math.sin(time * 3.5 + p.pulsePhase) * 0.8)
          ctx.strokeStyle = `rgba(240, 246, 255, ${(currentAlpha * 0.85).toFixed(3)})`
          ctx.lineWidth = 0.9
          ctx.beginPath()
          ctx.moveTo(p.x - sparkleLen, p.y)
          ctx.lineTo(p.x + sparkleLen, p.y)
          ctx.moveTo(p.x, p.y - sparkleLen)
          ctx.lineTo(p.x, p.y + sparkleLen)
          ctx.stroke()
        }
      }

      rafId = requestAnimationFrame(render)
    }

    // Helper: Draw continuous undulating fluid stream
    function drawWaterCurrent(
      c,
      w,
      h,
      t,
      yFactor,
      amplitude,
      colorStart,
      colorEnd,
      mx,
      my
    ) {
      c.save()
      const baseY = h * yFactor
      const step = 40
      const points = []

      for (let x = -40; x <= w + 40; x += step) {
        // Multi-frequency wave formula
        let waveY =
          baseY +
          Math.sin(x * 0.0035 + t) * amplitude +
          Math.cos(x * 0.0018 - t * 0.7) * (amplitude * 0.5)

        // Mouse displacement on wave surface
        const mDist = Math.hypot(x - mx, waveY - my)
        if (mDist < 200) {
          const mFactor = Math.sin((mDist / 200) * Math.PI)
          waveY += (1 - mDist / 200) * 18 * Math.sin(t * 4 + mFactor)
        }

        points.push({ x, y: waveY })
      }

      // Draw silky fluid ribbon
      c.beginPath()
      c.moveTo(points[0].x, points[0].y)

      for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2
        const yc = (points[i].y + points[i + 1].y) / 2
        c.quadraticCurveTo(points[i].x, points[i].y, xc, yc)
      }

      c.lineTo(w + 60, h + 60)
      c.lineTo(-60, h + 60)
      c.closePath()

      const grad = c.createLinearGradient(0, baseY - amplitude, w, baseY + amplitude * 2)
      grad.addColorStop(0, colorStart)
      grad.addColorStop(1, colorEnd)

      c.fillStyle = grad
      c.fill()
      c.restore()
    }

    // Pause loop when tab is hidden to preserve battery
    const onVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false
        if (rafId) cancelAnimationFrame(rafId)
      } else {
        if (!isRunning) {
          isRunning = true
          rafId = requestAnimationFrame(render)
        }
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    rafId = requestAnimationFrame(render)

    return () => {
      isRunning = false
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fluid-water-canvas"
      aria-hidden="true"
    />
  )
}

export default FluidWaterBackground
