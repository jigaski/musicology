import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './Landing.css'

function Landing() {
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

    function onMouseMove(e) {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    function onTouchMove(e) {
      mouse.x = e.touches[0].clientX
      mouse.y = e.touches[0].clientY
    }

    let t = 0
    function draw() {
      ctx.clearRect(0, 0, W, H)
      t++

      for (const s of stars) {
        const dx = mouse.x - s.x
        const dy = mouse.y - s.y
        const dist = Math.sqrt(dx * dx + dy * dy)

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
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = s.gold
          ? `rgba(245,200,66,${alpha * 0.9})`
          : `rgba(255,255,255,${alpha})`
        ctx.fill()

        if (s.r > 1.1) {
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2)
          const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 2.5)
          grd.addColorStop(0, s.gold
            ? `rgba(245,200,66,${alpha * 0.25})`
            : `rgba(255,255,255,${alpha * 0.18})`)
          grd.addColorStop(1, 'transparent')
          ctx.fillStyle = grd
          ctx.fill()
        }
      }

      animId = requestAnimationFrame(draw)
    }

    function onResize() {
      resize()
      initStars()
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('resize', onResize)

    resize()
    initStars()
    draw()

    // cleanup on unmount
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="landing">
      <canvas ref={canvasRef} className="starfield" />

      {/* HERO */}
      <section className="hero">
        <p className="hero-eyebrow">Your listening history, reimagined</p>
        <h1 className="hero-title">Musicology</h1>
        <p className="hero-sub">
          Client-side analytics for your Spotify data.<br />
          Nothing leaves your browser.
        </p>
        <a className="scroll-cue" href="#mission">
          <span>Learn More</span>
          <div className="scroll-arrow" />
        </a>
      </section>

      {/* MISSION */}
      <section className="mission" id="mission">
        <div className="mission-inner">
          <span className="section-label">Why?</span>
          <h2 className="mission-headline">
            Your music tells a story.<br />
            <em>You should be the one to read it.</em>
          </h2>
          <div className="mission-body">
            <p>
              Streaming platforms have years of intimate data about you — every late-night
              session, every phase, every obsession. That data belongs to you. Musicology
              exists to give it back in a form you can actually explore.
            </p>
            <div className="divider-horizontal"></div>
            <p>
              No accounts. No servers. No third-party APIs holding your listening history
              hostage. You drop in your Spotify export, and everything happens locally —
              visualized, searchable, and yours.
            </p>
            <p>
              Built for the listener who wants to understand the shape of their own taste:
              where it's been, how it's shifted, and what it says about who they've become.
            </p>
          </div>

          <div className="mission-stats">
            <div className="stat">
              <div className="stat-num">100%</div>
              <div className="stat-label">Client-side</div>
            </div>
            <div className="stat">
              <div className="stat-num">0</div>
              <div className="stat-label">Data uploaded</div>
            </div>
            <div className="stat">
              <div className="stat-num">∞</div>
              <div className="stat-label">History depth</div>
            </div>
          </div>

          <div className="cta-row">
            <Link to="/upload" className="btn-primary">Upload your data</Link>
            <a href="#how-it-works" className="btn-ghost">Learn how it works →</a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing