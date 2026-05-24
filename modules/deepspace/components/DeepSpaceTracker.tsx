'use client'

import { useState, useEffect, useCallback } from 'react'
import type { DeepSpaceProbe }              from '@/types/api'

// ── Types ──────────────────────────────────────────────────────
interface Props {
  initialProbes: DeepSpaceProbe[]
  updatedAt:     string
}

// ── Helpers ────────────────────────────────────────────────────

function formatAU(au: number): string {
  return au.toFixed(au < 1 ? 3 : 1)
}

function formatKm(au: number): string {
  const km = au * 149_597_870.7
  if (km >= 1_000_000_000) return `${(km / 1_000_000_000).toFixed(2)}B km`
  if (km >= 1_000_000)     return `${(km / 1_000_000).toFixed(1)}M km`
  return `${Math.round(km).toLocaleString()} km`
}

function formatSignalDelay(hours: number): string {
  if (hours < 1 / 60) return `${Math.round(hours * 3600)}s`
  if (hours < 1)      return `${Math.round(hours * 60)}m`
  return `${hours.toFixed(1)}h`
}

function formatVelocity(kms: number): string {
  if (kms >= 1000) return `${(kms / 1000).toFixed(1)}k km/s`
  return `${kms.toFixed(1)} km/s`
}

function missionAge(launchDate: string): string {
  const launch = new Date(launchDate)
  const now    = new Date()
  const years  = (now.getTime() - launch.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  if (years < 1) return `${Math.round(years * 12)} months`
  return `${years.toFixed(1)} years`
}

function statusColor(status: DeepSpaceProbe['communicationStatus']): string {
  switch (status) {
    case 'nominal':  return '#34d897'
    case 'degraded': return '#c9a96e'
    case 'lost':     return '#f05a5a'
  }
}

function probeColor(id: string): string {
  switch (id) {
    case 'voyager-1':          return 'rgba(180,140,255,0.9)'
    case 'voyager-2':          return '#3b9eff'
    case 'parker-solar-probe': return '#f05a5a'
    case 'europa-clipper':     return '#34d897'
    case 'lucy':               return '#c9a96e'
    default:                   return '#3b9eff'
  }
}

function probeIcon(id: string): string {
  switch (id) {
    case 'voyager-1':
    case 'voyager-2':          return '🛸'
    case 'parker-solar-probe': return '☀️'
    case 'europa-clipper':     return '🪐'
    case 'lucy':               return '🌌'
    default:                   return '🛰️'
  }
}

// Max known distance across all probes for scale bar
const MAX_DISTANCE_AU = 170

// ── Sub-components ─────────────────────────────────────────────

function DistanceBar({ au, color }: { au: number; color: string }) {
  const pct = Math.min((au / MAX_DISTANCE_AU) * 100, 100)
  return (
    <div style={{ marginTop: '10px' }}>
      <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
        <div
          style={{
            height:     '100%',
            width:      `${pct}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            borderRadius: '2px',
            transition: 'width 0.6s ease',
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(240,244,250,0.3)', letterSpacing: '0.1em' }}>
          SUN
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(240,244,250,0.3)', letterSpacing: '0.1em' }}>
          {MAX_DISTANCE_AU} AU
        </span>
      </div>
    </div>
  )
}

function TelemetryItem({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(240,244,250,0.4)' }}>
        {label}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 500, color: '#ffffff', letterSpacing: '0.04em' }}>
        {value}
      </span>
      {sub && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(240,244,250,0.45)', letterSpacing: '0.04em' }}>
          {sub}
        </span>
      )}
    </div>
  )
}

function ProbeCard({ probe }: { probe: DeepSpaceProbe }) {
  const color = probeColor(probe.id)

  return (
    <div
      style={{
        background:   'var(--surface)',
        border:       '1px solid var(--border)',
        borderRadius: '14px',
        overflow:     'hidden',
        transition:   'border-color 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      {/* Top accent line */}
      <div style={{ height: '2px', background: `linear-gradient(90deg, ${color}, transparent)` }} />

      <div style={{ padding: '22px 24px 24px' }}>

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '22px', lineHeight: 1 }}>{probeIcon(probe.id)}</span>
            <div>
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize:   '18px',
                fontWeight: 400,
                color:      '#ffffff',
                margin:     '0 0 2px',
                lineHeight: 1.2,
              }}>
                {probe.name}
              </h3>
              <span style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '9px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color:         color,
              }}>
                {probe.agency}
              </span>
            </div>
          </div>

          {/* Status badge */}
          <div style={{
            display:        'flex',
            alignItems:     'center',
            gap:            '5px',
            padding:        '4px 8px',
            borderRadius:   '4px',
            background:     `${statusColor(probe.communicationStatus)}12`,
            border:         `1px solid ${statusColor(probe.communicationStatus)}30`,
          }}>
            <span style={{
              width:        '6px',
              height:       '6px',
              borderRadius: '50%',
              background:   statusColor(probe.communicationStatus),
              display:      'block',
              flexShrink:   0,
              boxShadow:    `0 0 6px ${statusColor(probe.communicationStatus)}`,
              animation:    'blink 2s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      '9px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color:         statusColor(probe.communicationStatus),
            }}>
              {probe.communicationStatus}
            </span>
          </div>
        </div>

        {/* Mission info */}
        <div style={{
          display:      'flex',
          gap:          '6px',
          marginBottom: '20px',
          flexWrap:     'wrap',
        }}>
          <span style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      '9px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color:         'rgba(240,244,250,0.5)',
            background:    'rgba(255,255,255,0.05)',
            border:        '1px solid rgba(255,255,255,0.08)',
            padding:       '3px 8px',
            borderRadius:  '3px',
          }}>
            {probe.missionPhase}
          </span>
          {probe.targetBody && (
            <span style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      '9px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color:         'rgba(240,244,250,0.5)',
              background:    'rgba(255,255,255,0.05)',
              border:        '1px solid rgba(255,255,255,0.08)',
              padding:       '3px 8px',
              borderRadius:  '3px',
            }}>
              → {probe.targetBody}
            </span>
          )}
        </div>

        {/* Telemetry grid */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap:                 '16px 12px',
          marginBottom:        '20px',
          padding:             '16px',
          background:          'rgba(255,255,255,0.03)',
          borderRadius:        '8px',
          border:              '1px solid rgba(255,255,255,0.05)',
        }}>
          <TelemetryItem
            label="From Earth"
            value={`${formatAU(probe.distanceFromEarth)} AU`}
            sub={formatKm(probe.distanceFromEarth)}
          />
          <TelemetryItem
            label="From Sun"
            value={`${formatAU(probe.distanceFromSun)} AU`}
            sub={formatKm(probe.distanceFromSun)}
          />
          <TelemetryItem
            label="Velocity"
            value={formatVelocity(probe.velocity)}
            sub="heliocentric"
          />
          <TelemetryItem
            label="Signal Delay"
            value={formatSignalDelay(probe.signalDelay)}
            sub="one-way"
          />
        </div>

        {/* Distance scale bar */}
        <DistanceBar au={probe.distanceFromSun} color={color} />

        {/* Footer */}
        <div style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          marginTop:      '14px',
        }}>
          <span style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      '10px',
            color:         'rgba(240,244,250,0.35)',
            letterSpacing: '0.06em',
          }}>
            Launched {missionAge(probe.launchDate)} ago
          </span>
          <span style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      '10px',
            color:         'rgba(240,244,250,0.35)',
            letterSpacing: '0.06em',
          }}>
            {new Date(probe.launchDate).getFullYear()}
          </span>
        </div>

      </div>
    </div>
  )
}

// ── System scale diagram ───────────────────────────────────────

function SolarSystemScale({ probes }: { probes: DeepSpaceProbe[] }) {
  return (
    <div style={{
      background:   'var(--surface)',
      border:       '1px solid var(--border)',
      borderRadius: '14px',
      padding:      '24px',
      marginBottom: '32px',
    }}>
      <div style={{ marginBottom: '16px' }}>
        <span style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      '9px',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color:         'rgba(180,140,255,0.9)',
          display:       'block',
          marginBottom:  '4px',
        }}>
          Scale Overview
        </span>
        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize:   '16px',
          fontWeight: 400,
          color:      '#ffffff',
          margin:     0,
        }}>
          Probe Positions Relative to the Sun
        </h3>
      </div>

      {/* Scale bar with probe markers */}
      <div style={{ position: 'relative', height: '60px', marginTop: '20px' }}>
        {/* Base line */}
        <div style={{
          position:   'absolute',
          top:        '30px',
          left:       '16px',
          right:      '16px',
          height:     '1px',
          background: 'rgba(255,255,255,0.08)',
        }} />

        {/* Sun marker */}
        <div style={{
          position:    'absolute',
          left:        '16px',
          top:         '22px',
          width:       '16px',
          height:      '16px',
          borderRadius:'50%',
          background:  '#f5c518',
          boxShadow:   '0 0 12px #f5c51880',
          transform:   'translateX(-50%)',
        }} />

        {/* Probe markers */}
        {probes.map(probe => {
          const pct  = Math.min((probe.distanceFromSun / MAX_DISTANCE_AU) * 100, 98)
          const color = probeColor(probe.id)
          return (
            <div
              key={probe.id}
              style={{
                position:  'absolute',
                left:      `calc(16px + ${pct}% - 32px)`,
                top:       0,
                display:   'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap:        '2px',
              }}
            >
              <span style={{ fontSize: '11px', lineHeight: 1 }}>{probeIcon(probe.id)}</span>
              <div style={{
                width:        '8px',
                height:       '8px',
                borderRadius: '50%',
                background:   color,
                boxShadow:    `0 0 6px ${color}`,
                flexShrink:   0,
              }} />
              <span style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '8px',
                color:         color,
                letterSpacing: '0.04em',
                whiteSpace:    'nowrap',
              }}>
                {formatAU(probe.distanceFromSun)} AU
              </span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{
        display:        'flex',
        gap:            '16px',
        flexWrap:       'wrap',
        marginTop:      '8px',
        paddingTop:     '12px',
        borderTop:      '1px solid rgba(255,255,255,0.05)',
      }}>
        {probes.map(probe => (
          <div key={probe.id} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '11px' }}>{probeIcon(probe.id)}</span>
            <span style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      '10px',
              color:         probeColor(probe.id),
              letterSpacing: '0.06em',
            }}>
              {probe.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────

export function DeepSpaceTracker({ initialProbes, updatedAt }: Props) {
  const [probes,      setProbes]      = useState<DeepSpaceProbe[]>(initialProbes)
  const [lastUpdated, setLastUpdated] = useState(updatedAt)
  const [refreshing,  setRefreshing]  = useState(false)

  const refresh = useCallback(async () => {
    setRefreshing(true)
    try {
      const res  = await fetch('/api/deep-space', { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      setProbes(data.probes)
      setLastUpdated(data.updatedAt)
    } catch {
      // fail silently — keep showing last data
    } finally {
      setRefreshing(false)
    }
  }, [])

  // Auto-refresh every 60 minutes
  useEffect(() => {
    const id = setInterval(refresh, 60 * 60 * 1000)
    return () => clearInterval(id)
  }, [refresh])

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px 80px' }}>

      {/* Page header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{
            width:        '8px',
            height:       '8px',
            borderRadius: '50%',
            background:   'rgba(180,140,255,0.9)',
            boxShadow:    '0 0 10px rgba(180,140,255,0.5)',
            display:      'inline-block',
          }} />
          <span style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      '10px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color:         'rgba(180,140,255,0.9)',
          }}>
            Live Telemetry
          </span>
        </div>

        <h1 style={{
          fontFamily:  'var(--font-serif)',
          fontSize:    'clamp(32px, 4vw, 52px)',
          fontWeight:  300,
          color:       'var(--white)',
          margin:      '0 0 12px',
          letterSpacing: '-0.01em',
        }}>
          Deep Space Tracker
        </h1>

        <p style={{
          fontFamily:  'var(--font-sans)',
          fontSize:    '15px',
          color:       'rgba(240,244,250,0.6)',
          margin:      '0 0 20px',
          maxWidth:    '560px',
          lineHeight:  1.7,
        }}>
          Live telemetry for humanity's most distant emissaries — position, velocity,
          and signal delay updated from NASA Horizons System data.
        </p>

        {/* Last updated + refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      '10px',
            letterSpacing: '0.1em',
            color:         'rgba(240,244,250,0.35)',
          }}>
            Updated {new Date(lastUpdated).toLocaleString('en-US', {
              month: 'short', day: 'numeric',
              hour:  '2-digit', minute: '2-digit',
            })}
          </span>
          <button
            onClick={refresh}
            disabled={refreshing}
            style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      '10px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color:         refreshing ? 'rgba(240,244,250,0.3)' : 'rgba(180,140,255,0.8)',
              background:    'transparent',
              border:        '1px solid rgba(180,140,255,0.25)',
              borderRadius:  '4px',
              padding:       '4px 12px',
              cursor:        refreshing ? 'not-allowed' : 'pointer',
              transition:    'border-color 0.2s',
            }}
          >
            {refreshing ? 'Refreshing…' : '↻ Refresh'}
          </button>
        </div>
      </div>

      {/* Scale diagram */}
      <SolarSystemScale probes={probes} />

      {/* Probe cards */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap:                 '16px',
      }}>
        {probes.map(probe => (
          <ProbeCard key={probe.id} probe={probe} />
        ))}
      </div>

      {/* Data source note */}
      <div style={{
        marginTop:  '40px',
        padding:    '16px 20px',
        background: 'rgba(255,255,255,0.02)',
        border:     '1px solid rgba(255,255,255,0.06)',
        borderRadius: '8px',
      }}>
        <p style={{
          fontFamily:  'var(--font-mono)',
          fontSize:    '10px',
          letterSpacing: '0.08em',
          color:       'rgba(240,244,250,0.35)',
          margin:      0,
          lineHeight:  1.8,
        }}>
          Telemetry sourced from NASA JPL Horizons System. Distances in AU
          (1 AU = 149,597,870 km). Signal delay calculated at speed of light.
          Data refreshes every hour. Positions are heliocentric vector calculations.
        </p>
      </div>

    </div>
  )
}
