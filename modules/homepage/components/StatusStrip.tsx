export function StatusStrip() {
  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', background: '#0b0e13', display: 'flex', alignItems: 'stretch', overflowX: 'auto', padding: '0 48px' }}>

      {[
        { icon: '🛸', label: 'ISS Position',    value: '27,580 km/h',         sub: '● Live tracking',      subColor: '#34d897' },
        { icon: '🚀', label: 'Next Launch',      value: 'Falcon 9 · Crew Dragon', sub: 'T−2d 14h 32m',     subColor: 'rgba(240,244,250,0.7)' },
        { icon: '🌌', label: 'NASA APOD',        value: 'M42 — Orion Nebula',  sub: 'Updated today',       subColor: 'rgba(240,244,250,0.7)' },
        { icon: '🛰️', label: 'Voyager 1',        value: '23.6 billion km',     sub: 'Interstellar · 46 yrs', subColor: 'rgba(240,244,250,0.7)' },
        { icon: '🌍', label: 'Active Missions',  value: '47 worldwide',        sub: 'All agencies tracked', subColor: 'rgba(240,244,250,0.7)' },
      ].map((item, i, arr) => (
        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '22px 36px 22px 0', marginRight: '36px', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
            {item.icon}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,244,250,0.5)' }}>
              {item.label}
            </div>
            <div style={{ fontSize: '16px', fontWeight: 500, color: '#ffffff', letterSpacing: '-0.01em' }}>
              {item.value}
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: item.subColor }}>
              {item.sub}
            </div>
          </div>
        </div>
      ))}

    </div>
  )
}
