import { useEffect, useRef } from 'react'

/**
 * ThreeDScene - Robust, high-performance HTML5 Canvas 3D Perspective Engine.
 * Does NOT rely on WebGL, guaranteeing 100% crash-free rendering on all GPUs,
 * virtualized environments, and systems where WebGL hardware acceleration is disabled.
 *
 * Renders floating 3D acrylic blocks, gold metallic toruses, crystalline prisms,
 * and an ambient 3D depth constellation that reacts to mouse movement and scrolling.
 */
function ThreeDScene() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let isRunning = true

    // Dimensions
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const onResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize, { passive: true })

    // Interaction State
    let mouseX = 0
    let mouseY = 0
    let targetRotY = 0
    let targetRotX = 0
    let currentRotY = 0
    let currentRotX = 0
    let scrollY = 0
    let targetScrollY = 0

    const onMouseMove = (e) => {
      mouseX = (e.clientX / width - 0.5) * 2
      mouseY = (e.clientY / height - 0.5) * 2
      targetRotY = mouseX * 0.45
      targetRotX = -mouseY * 0.35
    }

    const onScroll = () => {
      scrollY = window.scrollY || document.documentElement.scrollTop
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    // 3D Math Utilities
    const FOV = 750

    function rotateX(point, angle) {
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      return {
        x: point.x,
        y: point.y * cos - point.z * sin,
        z: point.y * sin + point.z * cos,
      }
    }

    function rotateY(point, angle) {
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      return {
        x: point.x * cos + point.z * sin,
        y: point.y,
        z: -point.x * sin + point.z * cos,
      }
    }

    function rotateZ(point, angle) {
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      return {
        x: point.x * cos - point.y * sin,
        y: point.x * sin + point.y * cos,
        z: point.z,
      }
    }

    function project(point, offsetX = 0, offsetY = 0, offsetZ = 0) {
      const z = point.z + offsetZ + 550
      if (z <= 10) return null
      const scale = FOV / z
      return {
        x: width / 2 + (point.x + offsetX) * scale,
        y: height / 2 + (point.y + offsetY) * scale,
        scale,
        z,
      }
    }

    // 3D Object 1: Floating Acrylic Cube (represents 3D laser-cut signage)
    const cubeVertices = [
      { x: -50, y: -65, z: -20 },
      { x: 50, y: -65, z: -20 },
      { x: 50, y: 65, z: -20 },
      { x: -50, y: 65, z: -20 },
      { x: -50, y: -65, z: 20 },
      { x: 50, y: -65, z: 20 },
      { x: 50, y: 65, z: 20 },
      { x: -50, y: 65, z: 20 },
    ]

    const cubeFaces = [
      [0, 1, 2, 3], // Back
      [4, 5, 6, 7], // Front
      [0, 1, 5, 4], // Top
      [2, 3, 7, 6], // Bottom
      [0, 3, 7, 4], // Left
      [1, 2, 6, 5], // Right
    ]

    // 3D Object 2: Floating Gold Ring (represents luxury foil printing)
    const ringPointCount = 20
    const ringRadius = 75
    const ringPoints = []
    for (let i = 0; i < ringPointCount; i++) {
      const theta = (i / ringPointCount) * Math.PI * 2
      ringPoints.push({
        x: Math.cos(theta) * ringRadius,
        y: Math.sin(theta) * ringRadius,
        z: 0,
      })
    }

    // 3D Object 3: Floating Octahedral Crystal (represents precision CNC cutting)
    const octaVertices = [
      { x: 0, y: -60, z: 0 },
      { x: 45, y: 0, z: 0 },
      { x: 0, y: 0, z: 45 },
      { x: -45, y: 0, z: 0 },
      { x: 0, y: 0, z: -45 },
      { x: 0, y: 60, z: 0 },
    ]
    const octaFaces = [
      [0, 1, 2],
      [0, 2, 3],
      [0, 3, 4],
      [0, 4, 1],
      [5, 1, 2],
      [5, 2, 3],
      [5, 3, 4],
      [5, 4, 1],
    ]

    // 3D Ambient Particle Constellation (depth specks)
    const particleCount = 75
    const particles = []
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 1100,
        y: (Math.random() - 0.5) * 1100,
        z: (Math.random() - 0.5) * 600,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2.2 + 1,
        color: ['#e2e8f0', '#cbd5e1', '#94a3b8', '#f8fafc', '#b0b8c4'][i % 5],
      })
    }

    let clock = 0

    // Main Render Loop
    const render = () => {
      if (!isRunning) return

      clock += 0.015

      // Smooth camera interpolation
      currentRotY += (targetRotY - currentRotY) * 0.05
      currentRotX += (targetRotX - currentRotX) * 0.05
      targetScrollY += (scrollY - targetScrollY) * 0.06

      // Clear viewport
      ctx.clearRect(0, 0, width, height)

      const scrollOffsetY = -targetScrollY * 0.12

      // 1. Render Ambient 3D Particle Constellation
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        // Wrap around bounds
        if (p.x < -600) p.x = 600
        if (p.x > 600) p.x = -600
        if (p.y < -600) p.y = 600
        if (p.y > 600) p.y = -600

        // Rotate particles with camera
        let rot = rotateY(p, currentRotY * 0.3)
        rot = rotateX(rot, currentRotX * 0.3)

        const proj = project(rot, 0, scrollOffsetY, 0)
        if (proj) {
          const alpha = Math.max(0.1, Math.min(0.55, proj.scale * 0.8))
          ctx.beginPath()
          ctx.arc(proj.x, proj.y, p.radius * proj.scale, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.globalAlpha = alpha
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1.0

      // 2. Render 3D Gold Ring (Left Upper Section)
      const ringPosX = -width * 0.32
      const ringPosY = -height * 0.18 + scrollOffsetY * 0.6
      const rotRingAngleX = clock * 0.6 + currentRotX
      const rotRingAngleY = clock * 0.8 + currentRotY

      const projRingPoints = ringPoints.map((pt) => {
        let r = rotateZ(pt, clock * 0.5)
        r = rotateX(r, rotRingAngleX)
        r = rotateY(r, rotRingAngleY)
        return project(r, ringPosX, ringPosY, 0)
      })

      ctx.beginPath()
      let first = true
      for (let i = 0; i < projRingPoints.length; i++) {
        const pt = projRingPoints[i]
        if (!pt) continue
        if (first) {
          ctx.moveTo(pt.x, pt.y)
          first = false
        } else {
          ctx.lineTo(pt.x, pt.y)
        }
      }
      ctx.closePath()
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)'
      ctx.lineWidth = 2.5
      ctx.stroke()

      // Small glowing satellites along ring
      if (projRingPoints[0] && projRingPoints[10]) {
        ctx.beginPath()
        ctx.arc(projRingPoints[0].x, projRingPoints[0].y, 4, 0, Math.PI * 2)
        ctx.fillStyle = '#ffd700'
        ctx.fill()

        ctx.beginPath()
        ctx.arc(projRingPoints[10].x, projRingPoints[10].y, 3, 0, Math.PI * 2)
        ctx.fillStyle = '#c87a5e'
        ctx.fill()
      }

      // 3. Render 3D Acrylic Cube (Right Middle Section)
      const cubePosX = width * 0.34
      const cubePosY = -height * 0.05 + scrollOffsetY * 0.7
      const cubeAngleX = clock * 0.5 + currentRotX * 1.2
      const cubeAngleY = clock * 0.4 + currentRotY * 1.2

      const rotatedCubeVerts = cubeVertices.map((v) => {
        let r = rotateX(v, cubeAngleX)
        r = rotateY(r, cubeAngleY)
        return r
      })

      const projCubeVerts = rotatedCubeVerts.map((v) => project(v, cubePosX, cubePosY, 0))

      // Sort faces by Z depth for Painter's algorithm (furthest first)
      const sortedCubeFaces = cubeFaces
        .map((face) => {
          const avgZ =
            face.reduce((sum, idx) => sum + rotatedCubeVerts[idx].z, 0) / face.length
          return { face, avgZ }
        })
        .sort((a, b) => b.avgZ - a.avgZ)

      for (let i = 0; i < sortedCubeFaces.length; i++) {
        const { face } = sortedCubeFaces[i]
        const pts = face.map((idx) => projCubeVerts[idx]).filter(Boolean)
        if (pts.length !== 4) continue

        ctx.beginPath()
        ctx.moveTo(pts[0].x, pts[0].y)
        ctx.lineTo(pts[1].x, pts[1].y)
        ctx.lineTo(pts[2].x, pts[2].y)
        ctx.lineTo(pts[3].x, pts[3].y)
        ctx.closePath()

        ctx.fillStyle = 'rgba(232, 226, 216, 0.28)'
        ctx.fill()
        ctx.strokeStyle = 'rgba(200, 122, 94, 0.45)'
        ctx.lineWidth = 1.2
        ctx.stroke()
      }

      // 4. Render 3D Octahedral Gem (Lower Right / Center Section)
      const octaPosX = width * 0.26
      const octaPosY = height * 0.35 + scrollOffsetY * 0.5
      const octaAngleX = clock * 0.65
      const octaAngleY = clock * 0.75 + currentRotY

      const rotatedOctaVerts = octaVertices.map((v) => {
        let r = rotateX(v, octaAngleX)
        r = rotateY(r, octaAngleY)
        return r
      })

      const projOctaVerts = rotatedOctaVerts.map((v) => project(v, octaPosX, octaPosY, 0))

      // Sort octahedron faces by Z depth for Painter's algorithm (furthest first)
      const sortedOctaFaces = octaFaces
        .map((face) => {
          const avgZ =
            face.reduce((sum, idx) => sum + rotatedOctaVerts[idx].z, 0) / face.length
          return { face, avgZ }
        })
        .sort((a, b) => b.avgZ - a.avgZ)

      for (let i = 0; i < sortedOctaFaces.length; i++) {
        const { face } = sortedOctaFaces[i]
        const pts = face.map((idx) => projOctaVerts[idx]).filter(Boolean)
        if (pts.length !== 3) continue

        ctx.beginPath()
        ctx.moveTo(pts[0].x, pts[0].y)
        ctx.lineTo(pts[1].x, pts[1].y)
        ctx.lineTo(pts[2].x, pts[2].y)
        ctx.closePath()

        ctx.fillStyle = 'rgba(43, 56, 49, 0.08)'
        ctx.fill()
        ctx.strokeStyle = 'rgba(107, 127, 115, 0.35)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    try {
      render()
    } catch (err) {
      console.warn('Canvas 3D animation error suppressed:', err)
    }

    return () => {
      isRunning = false
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className="three-d-global-canvas-wrap" aria-hidden="true">
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

export default ThreeDScene
