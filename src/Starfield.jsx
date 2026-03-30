import { useEffect, useRef } from 'react'
import './Upload.css'

export default function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    let W, H, stars = [], animId
    const mouse = { x: -9999, y: -9999 }
    const STAR_COUNT = 320
    const CURSOR_RADIUS = 130
    const RETURN_SPEED = 0.045

    function resize() {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }

    function initStars() {
      stars = []
      for (let i = 0; i < STAR_COUNT; i++) {
        const x = Math.random() * W
        const y = Math.random() * H
        stars.push({
          ox: x, oy: y, x, y,
          vx: 0, vy: 0,
          r: Math.random() * 1.3 + 0.2,
          alpha: Math.random() * 0.6 + 0.1,
          twinkleOffset: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.003 + Math.random() * 0.005,
          gold: Math.random() < 0.06,
        })
      }
    }

    function onMouseMove(e) { mouse.x = e.clientX; mouse.y = e.clientY }
    function onTouchMove(e) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY }

    let t = 0
    function draw() {
      ctx.clearRect(0, 0, W, H)
      t++
      for (const s of stars) {
        const dx = mouse.x - s.x
        const dy = mouse.y - s.y
        const dist = Math.sqrt(dx*dx + dy*dy)

        if (dist < CURSOR_RADIUS && dist > 0.1) {
          const force = (CURSOR_RADIUS - dist) / CURSOR_RADIUS
          s.vx -= (dx / dist) * force * 1.6
          s.vy -= (dy / dist) * force * 1.6
        }

        s.vx += (s.ox - s.x) * RETURN_SPEED
        s.vy += (s.oy - s.y) * RETURN_SPEED
        s.vx *= 0.82
        s.vy *= 0.82
        s.x += s.vx * 0.012 * 60
        s.y += s.vy * 0.012 * 60

        const twinkle = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset)
        const alpha = s.alpha * (0.6 + 0.4 * twinkle)

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI*2)
        ctx.fillStyle = s.gold ? `rgba(245,200,66,${alpha*0.9})` : `rgba(255,255,255,${alpha})`
        ctx.fill()

        if (s.r > 1.1) {
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r*2.5, 0, Math.PI*2)
          const grd = ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*2.5)
          grd.addColorStop(0, s.gold ? `rgba(245,200,66,${alpha*0.25})` : `rgba(255,255,255,${alpha*0.18})`)
          grd.addColorStop(1,'transparent')
          ctx.fillStyle = grd
          ctx.fill()
        }
      }

      animId = requestAnimationFrame(draw)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('resize', () => { resize(); initStars() })

    resize()
    initStars()
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="starfield" />
}