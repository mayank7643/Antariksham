import Link from 'next/link'

export function LatestNewsSection() {
  return (
    <section style={{ padding: '80px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '48px' }}>
        <div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#3b9eff', marginBottom: '10px' }}>Editorial</div>
          <div style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: '40px', fontWeight: 400, color: '#ffffff', lineHeight: 1.1 }}>Space Intelligence & Journalism</div>
        </div>
        <Link href="/news" style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,244,250,0.6)', textDecoration: 'none' }}>
          All articles →
        </Link>
      </div>

      {/* TOP ROW — 3 big cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>

        {/* LEAD BIG */}
        <div style={{ background: '#10151c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '40px', cursor: 'pointer', minHeight: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3b9eff', marginBottom: '20px' }}>NASA · Artemis</div>
            <h2 style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: '32px', fontWeight: 400, lineHeight: 1.2, color: '#ffffff', marginBottom: '20px' }}>
              Artemis III Moon Landing Delayed Again — NASA Cites Spacesuit Readiness and Orion Heat Shield Concerns
            </h2>
            <p style={{ fontSize: '16px', fontWeight: 400, lineHeight: 1.75, color: 'rgba(240,244,250,0.8)' }}>
              The agency has pushed the first crewed lunar landing since Apollo 17 past its 2026 target, citing ongoing development delays with Axiom Space's xEMU spacesuit system.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'rgba(240,244,250,0.5)', marginTop: '24px' }}>
            <span>By Priya Nair · 12 min read</span>
            <span style={{ padding: '4px 12px', borderRadius: '3px', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', background: 'rgba(240,90,90,0.15)', color: '#f05a5a' }}>Breaking</span>
          </div>
        </div>

        {/* CARD 2 */}
        <div style={{ background: '#10151c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '32px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9f7aea', marginBottom: '16px' }}>SpaceX · Starship</div>
            <h3 style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: '24px', fontWeight: 400, lineHeight: 1.25, color: '#ffffff', marginBottom: '16px' }}>
              Starship IFT-8 Achieves Perfect Booster Catch — A New Era of Reusability
            </h3>
            <p style={{ fontSize: '14px', fontWeight: 400, lineHeight: 1.7, color: 'rgba(240,244,250,0.75)' }}>
              The eighth integrated flight test marks the first fully successful Mechazilla catch, validating rapid reusability at scale.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'rgba(240,244,250,0.45)', marginTop: '20px' }}>
            <span>6 min read</span>
            <span style={{ padding: '4px 10px', borderRadius: '3px', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', background: 'rgba(59,158,255,0.12)', color: '#3b9eff' }}>Analysis</span>
          </div>
        </div>

        {/* CARD 3 */}
        <div style={{ background: '#10151c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '32px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#34d897', marginBottom: '16px' }}>Discovery · JWST</div>
            <h3 style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: '24px', fontWeight: 400, lineHeight: 1.25, color: '#ffffff', marginBottom: '16px' }}>
              JWST Detects Possible Biosignature in K2-18b Atmosphere
            </h3>
            <p style={{ fontSize: '14px', fontWeight: 400, lineHeight: 1.7, color: 'rgba(240,244,250,0.75)' }}>
              A spectral signal consistent with dimethyl sulfide sparks careful scientific debate about biological vs. abiotic origins.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'rgba(240,244,250,0.45)', marginTop: '20px' }}>
            <span>9 min read</span>
            <span style={{ padding: '4px 10px', borderRadius: '3px', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', background: 'rgba(52,216,151,0.12)', color: '#34d897' }}>Research</span>
          </div>
        </div>

      </div>

      {/* BOTTOM ROW — 4 smaller cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>

        {[
          { cat: 'ISRO · Moon', color: '#c9a96e', title: 'Chandrayaan-4 Mission Architecture Revealed — Sample Return by 2027', time: '5 min', tag: 'Mission', tagColor: '#c9a96e', tagBg: 'rgba(201,169,110,0.12)' },
          { cat: 'Astronomy · Solar', color: '#f97316', title: 'Sun Reaches Solar Maximum — Strongest Activity in Two Decades', time: '4 min', tag: 'Science', tagColor: '#fb923c', tagBg: 'rgba(249,115,22,0.12)' },
          { cat: 'ESA · Mars', color: '#e879f9', title: 'ExoMars Rosalind Franklin Rover Gets New Launch Window for 2028', time: '3 min', tag: 'Mission', tagColor: '#e879f9', tagBg: 'rgba(232,121,249,0.12)' },
          { cat: 'NASA · Deep Space', color: '#3b9eff', title: 'Voyager 1 Resumes Full Science Operations After 5-Month Anomaly', time: '7 min', tag: 'Update', tagColor: '#3b9eff', tagBg: 'rgba(59,158,255,0.12)' },
        ].map((item) => (
          <div key={item.title} style={{ background: '#10151c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: item.color, marginBottom: '12px' }}>{item.cat}</div>
              <h4 style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: '18px', fontWeight: 400, lineHeight: 1.3, color: '#ffffff' }}>{item.title}</h4>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(240,244,250,0.45)', marginTop: '16px' }}>
              <span>{item.time} read</span>
              <span style={{ padding: '3px 8px', borderRadius: '3px', fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase', background: item.tagBg, color: item.tagColor }}>{item.tag}</span>
            </div>
          </div>
        ))}

      </div>

    </section>
  )
}
