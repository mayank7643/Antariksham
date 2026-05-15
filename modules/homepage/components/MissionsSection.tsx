import Link from 'next/link'

export function MissionsSection() {
  return (
    <section style={{ padding: '70px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '38px' }}>
        <div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '8px', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#3b9eff', marginBottom: '6px' }}>Mission Tracking</div>
          <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: '26px', fontWeight: 300 }}>Active & Upcoming Missions</div>
        </div>
        <Link href="/missions" style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(238,241,246,0.22)', textDecoration: 'none' }}>
          All missions →
        </Link>
      </div>

      {/* GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>

        {[
          {
            agency: 'NASA · Lunar',
            name: 'Artemis III',
            status: 'upcoming',
            statusLabel: 'Upcoming · 2026+',
            desc: 'First crewed lunar landing since Apollo 17. Targets Shackleton crater rim at the lunar south pole.',
            color: '#3b9eff',
          },
          {
            agency: 'NASA · Jupiter',
            name: 'Europa Clipper',
            status: 'active',
            statusLabel: 'En Route · Active',
            desc: 'Investigating habitability of Europa\'s subsurface ocean. 49 planned flybys. Arrives at Jupiter in 2030.',
            color: '#3b9eff',
          },
          {
            agency: 'SpaceX · Orbit',
            name: 'Starship IFT-8',
            status: 'completed',
            statusLabel: 'Completed',
            desc: 'Eighth integrated flight test achieved full-stack reusability milestone with perfect booster catch.',
            color: '#9f7aea',
          },
          {
            agency: 'ISRO · Lunar',
            name: 'Chandrayaan-4',
            status: 'upcoming',
            statusLabel: 'Development · 2027',
            desc: 'India\'s first lunar sample return mission. Will collect 3 kg of south pole regolith.',
            color: '#c9a96e',
          },
        ].map((mission) => (
          <div key={mission.name} style={{ background: '#10151c', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '22px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: mission.color, opacity: 0 }} />
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(238,241,246,0.22)', marginBottom: '7px' }}>
              {mission.agency}
            </div>
            <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: '17px', fontWeight: 400, marginBottom: '9px', lineHeight: 1.2 }}>
              {mission.name}
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'DM Mono, monospace', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px', color: mission.status === 'active' ? '#34d897' : mission.status === 'upcoming' ? '#3b9eff' : 'rgba(238,241,246,0.22)' }}>
              {mission.status === 'active' ? '● ' : mission.status === 'upcoming' ? '◌ ' : '○ '}
              {mission.statusLabel}
            </div>
            <div style={{ fontSize: '11px', fontWeight: 300, lineHeight: 1.6, color: 'rgba(238,241,246,0.5)' }}>
              {mission.desc}
            </div>
          </div>
        ))}

      </div>
    </section>
  )
}
