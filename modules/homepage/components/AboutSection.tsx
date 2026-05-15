import Link from 'next/link'

export function AboutSection() {
  return (
    <section style={{ padding: '80px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>

        <div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#3b9eff', marginBottom: '20px' }}>Our Mission</div>
          <blockquote style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: '32px', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.4, color: '#ffffff', marginBottom: '28px', padding: 0, border: 'none', margin: '0 0 28px 0' }}>
            "Antariksham is built on a simple belief — that space belongs to everyone, and understanding it should be <strong style={{ fontStyle: 'normal', fontWeight: 400 }}>accessible, scientific, and deeply honest.</strong>"
          </blockquote>
          <p style={{ fontSize: '16px', fontWeight: 400, lineHeight: 1.75, color: 'rgba(240,244,250,0.7)', marginBottom: '36px', maxWidth: '520px' }}>
            An independent platform committed to scientific accuracy, editorial integrity, and building the most credible space knowledge ecosystem on the web. Not a news portal. Not a blog. A space intelligence organization.
          </p>
          <Link href="/about" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', border: '1px solid rgba(255,255,255,0.16)', color: 'rgba(240,244,250,0.8)', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '6px', fontFamily: 'DM Mono, monospace' }}>
            Our Mission →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { num: '47', label: 'Missions\nTracked' },
            { num: '6',  label: 'Live\nSystems' },
            { num: '.org', label: 'Trust\nFirst' },
          ].map((stat) => (
            <div key={stat.label} style={{ background: '#10151c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '32px 24px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: '48px', fontWeight: 300, color: '#ffffff', lineHeight: 1, marginBottom: '12px' }}>{stat.num}</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,244,250,0.45)', whiteSpace: 'pre-line', lineHeight: 1.5 }}>{stat.label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
