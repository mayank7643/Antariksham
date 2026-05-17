'use client'

import { useEffect, useState, useRef } from 'react'
import { fetchISSPosition, latLngToSVG } from '@/modules/iss/services/getISS'
import type { ISSPosition, ISSCrew } from '@/types/api'

interface Props {
  initialPosition: ISSPosition | null
  crew:            ISSCrew[]
}

const MAP_W = 1000
const MAP_H = 500
const MAX_TRAIL = 60 // keep last 60 positions for trail

export function ISSTracker({ initialPosition, crew }: Props) {
  const [position, setPosition]   = useState<ISSPosition | null>(initialPosition)
  const [trail, setTrail]         = useState<{ x: number; y: number }[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isLive, setIsLive]       = useState(true)
  const intervalRef               = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Add initial position to trail
    if (initialPosition) {
      const pt = latLngToSVG(initialPosition.latitude, initialPosition.longitude, MAP_W, MAP_H)
      setTrail([pt])
    }

    // Poll every 5 seconds
    intervalRef.current = setInterval(async () => {
      const pos = await fetchISSPosition()
      if (pos) {
        setPosition(pos)
        setLastUpdate(new Date())
        setIsLive(true)
        const pt = latLngToSVG(pos.latitude, pos.longitude, MAP_W, MAP_H)
        setTrail(prev => {
          const next = [...prev, pt]
          return next.slice(-MAX_TRAIL)
        })
      } else {
        setIsLive(false)
      }
    }, 5000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const dot = position
    ? latLngToSVG(position.latitude, position.longitude, MAP_W, MAP_H)
    : null

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: 'var(--nav-height)' }}>

      {/* ── Header ──────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: 'clamp(24px,4vw,48px) clamp(20px,5vw,48px) 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: isLive ? '#34d897' : '#f05a5a', display: 'inline-block', boxShadow: isLive ? '0 0 8px #34d897' : 'none' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: isLive ? '#34d897' : '#f05a5a' }}>
                {isLive ? 'Live' : 'Signal Lost'}
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 300, color: '#f0f4fa', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
              ISS Live Tracker
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(240,244,250,0.35)', margin: 0, letterSpacing: '0.05em' }}>
              Updates every 5 seconds · {crew.length} crew aboard
            </p>
          </div>

          {/* Live stats */}
          {position && (
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <StatBox label="Latitude"  value={`${position.latitude.toFixed(4)}°`} />
              <StatBox label="Longitude" value={`${position.longitude.toFixed(4)}°`} />
              <StatBox label="Altitude"  value={`${position.altitude} km`} />
              <StatBox label="Velocity"  value={`${position.velocity.toLocaleString()} km/h`} />
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(24px,4vw,40px) clamp(20px,5vw,48px)' }}>

        {/* ── World Map ────────────────────────────── */}
        <div style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '28px', background: '#050810', position: 'relative' }}>
          <svg
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            style={{ width: '100%', display: 'block' }}
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ocean background */}
            <rect width={MAP_W} height={MAP_H} fill="#050810" />

            {/* Grid lines */}
            {[-60,-30,0,30,60].map(lat => {
              const y = ((90 - lat) / 180) * MAP_H
              return <line key={lat} x1={0} y1={y} x2={MAP_W} y2={y} stroke="rgba(59,158,255,0.08)" strokeWidth={0.5} />
            })}
            {[-120,-60,0,60,120].map(lng => {
              const x = ((lng + 180) / 360) * MAP_W
              return <line key={lng} x1={x} y1={0} x2={x} y2={MAP_H} stroke="rgba(59,158,255,0.08)" strokeWidth={0.5} />
            })}

            {/* Equator */}
            <line x1={0} y1={MAP_H/2} x2={MAP_W} y2={MAP_H/2} stroke="rgba(59,158,255,0.15)" strokeWidth={1} />

            {/* ISS trail */}
            {trail.length > 1 && trail.map((pt, i) => {
              if (i === 0) return null
              const prev = trail[i - 1]
              // Don't draw line if it crosses the date line (large x jump)
              if (Math.abs(pt.x - prev.x) > MAP_W / 2) return null
              const opacity = (i / trail.length) * 0.6
              return (
                <line
                  key={i}
                  x1={prev.x} y1={prev.y}
                  x2={pt.x}   y2={pt.y}
                  stroke="#3b9eff"
                  strokeWidth={1.5}
                  strokeOpacity={opacity}
                />
              )
            })}

            {/* ISS dot */}
            {dot && (
              <>
                {/* Pulse ring */}
                <circle cx={dot.x} cy={dot.y} r={12} fill="none" stroke="#34d897" strokeWidth={1} strokeOpacity={0.3}>
                  <animate attributeName="r" values="8;18;8" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
                {/* ISS marker */}
                <circle cx={dot.x} cy={dot.y} r={5} fill="#34d897" />
                <circle cx={dot.x} cy={dot.y} r={3} fill="#07090c" />
              </>
            )}
          </svg>

          {/* Last update timestamp */}
          <div style={{ position: 'absolute', bottom: '12px', right: '16px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(240,244,250,0.3)', letterSpacing: '0.05em' }}>
            Updated {lastUpdate.toLocaleTimeString()}
          </div>
        </div>

        {/* ── Crew Section ─────────────────────────── */}
        {crew.length > 0 && (
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#3b9eff', display: 'block', marginBottom: '16px' }}>
              Current Crew — {crew.length} Astronauts
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {crew.map((member, i) => (
                <div key={i} style={{ background: '#10151c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(59,158,255,0.15)', border: '1px solid rgba(59,158,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '16px' }}>
                    👨‍🚀
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#f0f4fa', margin: '0 0 3px', fontWeight: 500 }}>
                      {member.name}
                    </p>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#34d897' }}>
                      {member.craft}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <a href="/live" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3b9eff', textDecoration: 'none' }}>
            ← Back to Live
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Stat box ──────────────────────────────────────────────────
function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#10151c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px 16px', minWidth: '120px' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,244,250,0.35)', display: 'block', marginBottom: '4px' }}>
        {label}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#34d897', letterSpacing: '0.05em' }}>
        {value}
      </span>
    </div>
  )
          }
