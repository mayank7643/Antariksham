import Link from 'next/link'

export function AboutSection() {
  return (
    <section style={{ padding: '70px 0' }}>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '60px', alignItems: 'center' }}>

        {/* LEFT */}
        <div>
          <blockquote style={{ fontFamily: 'Crimson Pro, serif', fontSize: 'clamp(18px, 2.2vw, 27px)', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.55, color: 'rgba(238,241,246,0.5)', maxWidth: '660px', marginBottom: '20px', margin: '0 0 20px 0', padding: 0, border: 'none' }}>
            "<strong style={{ fontStyle: 'normal', color: '#eef1f6', fontWeight: 400 }}>Antariksham</strong> is built on a simple belief — that space belongs to everyone, and understanding it should be accessible, scientific, and deeply honest."
          </blockquote>
          <p style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(238,241,246,0.22)', lineHeight: 1.75, maxWidth: '540px', margin: '0 0 28px 0' }}>
            An independent platform committed to scientific accuracy, editorial integrity, and building the most credible space knowledge ecosystem on the web. Not a news portal. Not a blog. A space intelligence organization.
          </p>
          <Link href="/about" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px', border: '1px solid rgba(255,255,255,0.13)', color: 'rgba(238,241,246,0.5)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '4px', fontFamily: 'DM Mono, monospace' }}>
            Our Mission →
          </Link>
        </div>

        {/* RIGHT — STATS */}
        <div style={{ display: 'flex', gap: '40px', flexShrink: 0 }}>
          {[
            { num: '47',   label: 'Missions tracked' },
            { num: '6',    label: 'Live systems' },
            { num: '.org', label: 'Trust-first' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <span style={{ fontFamily: 'Crimson Pro, serif', fontSize: '38px', fontWeight: 300, display: 'block', lineHeight: 1, marginBottom: '6px' }}>
                {stat.num}
              </span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(238,241,246,0.22)' }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

      </div>

    </section>
  )
}
