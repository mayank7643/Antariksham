'use client'

import Link from 'next/link'

export function HeroSection() {
  return (
    <section style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '60px' }}>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 440px', alignItems: 'center', maxWidth: '1380px', margin: '0 auto', width: '100%', padding: '90px 48px 60px' }}>

        {/* LEFT */}
        <div style={{ paddingRight: '64px' }}>

          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
            <div style={{ width: '28px', height: '1px', background: '#3b9eff', opacity: 0.5 }} />
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#3b9eff' }}>
              Independent Space Intelligence Platform
            </span>
          </div>

          {/* H1 */}
          <h1 style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: 'clamp(46px, 5.5vw, 80px)', fontWeight: 300, lineHeight: 1.07, letterSpacing: '-0.01em', marginBottom: '26px', margin: '0 0 26px 0' }}>
            Exploring the Universe<br />
            Through{' '}
            <em style={{ fontStyle: 'italic', color: 'rgba(238,241,246,0.5)' }}>
              Knowledge,
            </em>
            <br />
            Research &amp; Discovery
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: '14px', fontWeight: 300, lineHeight: 1.75, color: 'rgba(238,241,246,0.5)', maxWidth: '440px', margin: '26px 0 44px 0' }}>
            Scientific journalism, live mission tracking, deep-space telemetry, and an educational knowledge engine — all in one independent platform built for serious space enthusiasts.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/news" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 26px', background: '#3b9eff', color: '#07090c', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '4px' }}>
              Read Latest
            </Link>
            <Link href="/live" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 22px', border: '1px solid rgba(255,255,255,0.13)', color: 'rgba(238,241,246,0.5)', fontSize: '11px', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '4px' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#34d897', boxShadow: '0 0 8px #34d897', display: 'inline-block', animation: 'blink 2s infinite' }} />
              View Live Systems
            </Link>
          </div>

        </div>

        {/* RIGHT — FEATURED CARD */}
        <div>
          <div style={{ background: '#10151c', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', overflow: 'hidden', cursor: 'pointer' }}>

            {/* Visual */}
            <div style={{ height: '210px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #080f20 0%, #0c1830 50%, #070e1c 100%)' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 55% 50% at 65% 40%, rgba(59,158,255,0.18) 0%, transparent 65%), radial-gradient(ellipse 40% 55% at 25% 65%, rgba(201,169,110,0.12) 0%, transparent 55%)' }} />
              <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', width: '180px', height: '36px', borderRadius: '50%', border: '1.5px solid rgba(201,169,110,0.35)', transform: 'rotateX(72deg)' }} />
                <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: 'radial-gradient(circle at 36% 34%, #1e4080, #0c2044 55%, #060f22)', boxShadow: 'inset -18px -18px 36px rgba(0,0,0,0.9), inset 8px 8px 24px rgba(59,158,255,0.18)', position: 'relative', zIndex: 2 }} />
              </div>
              <div style={{ position: 'absolute', top: '14px', left: '14px', fontFamily: 'DM Mono, monospace', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '2px', background: 'rgba(59,158,255,0.1)', border: '1px solid rgba(59,158,255,0.25)', color: '#3b9eff' }}>
                Featured Story
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '24px' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '8px' }}>NASA · Saturn Mission</div>
              <h3 style={{ fontFamily: 'Crimson Pro, serif', fontSize: '19px', fontWeight: 400, lineHeight: 1.3, marginBottom: '10px' }}>
                Cassini's Legacy: New Data Reveals Ocean Activity Deep Within Enceladus
              </h3>
              <p style={{ fontSize: '12px', fontWeight: 300, lineHeight: 1.65, color: 'rgba(238,241,246,0.5)', marginBottom: '16px' }}>
                Researchers reanalysing Cassini's final passes have found evidence of active hydrothermal vents at Enceladus's seafloor — raising the probability of microbial life.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(238,241,246,0.22)' }}>
                <span>10 min read · Research</span>
                <span style={{ color: '#3b9eff' }}>Read full story →</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
      }
