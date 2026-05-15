'use client'

import Link from 'next/link'

export function HeroSection() {
  return (
    <section style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '60px' }}>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 480px', alignItems: 'center', maxWidth: '1380px', margin: '0 auto', width: '100%', padding: '80px 48px 60px', gap: '60px' }}>

        {/* LEFT */}
        <div>
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div style={{ width: '28px', height: '1px', background: '#3b9eff', opacity: 0.6 }} />
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#3b9eff' }}>
              Independent Space Intelligence Platform
            </span>
          </div>

          {/* H1 */}
          <h1 style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: 'clamp(42px, 4.5vw, 68px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.01em', marginBottom: '28px', color: '#ffffff' }}>
            Exploring the Universe<br />
            Through{' '}
            <em style={{ fontStyle: 'italic', color: '#3b9eff', fontWeight: 300 }}>Knowledge,</em>
            <br />
            Research &amp; Discovery
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: '17px', fontWeight: 400, lineHeight: 1.75, color: 'rgba(240,244,250,0.8)', maxWidth: '500px', marginBottom: '44px' }}>
            Scientific journalism, live mission tracking, deep-space telemetry, and an educational knowledge engine — all in one independent platform built for serious space enthusiasts.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/news" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', background: '#3b9eff', color: '#07090c', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '5px', fontFamily: 'DM Mono, monospace' }}>
              Read Latest
            </Link>
            <Link href="/live" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 28px', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(240,244,250,0.85)', fontSize: '12px', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '5px', fontFamily: 'DM Mono, monospace' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d897', boxShadow: '0 0 8px #34d897', display: 'inline-block', flexShrink: 0 }} />
              View Live Systems
            </Link>
          </div>
        </div>

        {/* RIGHT — FEATURED CARD */}
        <div style={{ background: '#10151c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', overflow: 'hidden' }}>

          {/* Visual */}
          <div style={{ height: '220px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #080f20 0%, #0c1830 50%, #070e1c 100%)' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 55% 50% at 65% 40%, rgba(59,158,255,0.18) 0%, transparent 65%), radial-gradient(ellipse 40% 55% at 25% 65%, rgba(201,169,110,0.12) 0%, transparent 55%)' }} />
            <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', width: '200px', height: '40px', borderRadius: '50%', border: '1.5px solid rgba(201,169,110,0.35)', transform: 'rotateX(72deg)' }} />
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle at 36% 34%, #1e4080, #0c2044 55%, #060f22)', boxShadow: 'inset -20px -20px 40px rgba(0,0,0,0.9), inset 8px 8px 24px rgba(59,158,255,0.18)', position: 'relative', zIndex: 2 }} />
            </div>
            <div style={{ position: 'absolute', top: '16px', left: '16px', fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: '3px', background: 'rgba(59,158,255,0.12)', border: '1px solid rgba(59,158,255,0.25)', color: '#3b9eff' }}>
              Featured Story
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '28px' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '12px' }}>
              NASA · Saturn Mission
            </div>
            <h3 style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: '22px', fontWeight: 400, lineHeight: 1.3, color: '#ffffff', marginBottom: '12px' }}>
              Cassini's Legacy: New Data Reveals Ocean Activity Deep Within Enceladus
            </h3>
            <p style={{ fontSize: '14px', fontWeight: 400, lineHeight: 1.7, color: 'rgba(240,244,250,0.78)', marginBottom: '20px' }}>
              Researchers reanalysing Cassini's final passes have found evidence of active hydrothermal vents at Enceladus's seafloor — raising the probability of microbial life.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'rgba(240,244,250,0.45)', letterSpacing: '0.06em' }}>10 min read · Research</span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '13px', color: '#3b9eff', letterSpacing: '0.06em', fontWeight: 500 }}>Read full story →</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
