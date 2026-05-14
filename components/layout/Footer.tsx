import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { footerNav } from '@/config/navigation'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: '#0b0e13', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '52px 48px 32px' }}>
      <div style={{ maxWidth: '1380px', margin: '0 auto' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>

          {/* BRAND */}
          <div>
            <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: '19px', fontWeight: 400, letterSpacing: '0.03em', marginBottom: '12px' }}>
              {siteConfig.name}
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#3b9eff', marginLeft: '2px' }}>{siteConfig.tld}</span>
            </div>
            <p style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(238,241,246,0.22)', lineHeight: 1.7, maxWidth: '220px', marginBottom: '18px' }}>
              {siteConfig.description}
            </p>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3b9eff', opacity: 0.55 }}>
              {siteConfig.positioning}
            </div>
          </div>

          {/* PLATFORM */}
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(238,241,246,0.22)', marginBottom: '14px' }}>
              Platform
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {footerNav.platform.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(238,241,246,0.5)', textDecoration: 'none' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* INTELLIGENCE */}
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(238,241,246,0.22)', marginBottom: '14px' }}>
              Intelligence
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {footerNav.intelligence.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(238,241,246,0.5)', textDecoration: 'none' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ORGANIZATION */}
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(238,241,246,0.22)', marginBottom: '14px' }}>
              Organization
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {footerNav.organization.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(238,241,246,0.5)', textDecoration: 'none' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* BOTTOM */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '22px', borderTop: '1px solid rgba(255,255,255,0.06)', fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(238,241,246,0.22)', letterSpacing: '0.08em' }}>
          <span>© {year} {siteConfig.domain} — {siteConfig.positioning}</span>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/privacy" style={{ color: 'rgba(238,241,246,0.22)', textDecoration: 'none' }}>Privacy</Link>
            <Link href="/editorial-policy" style={{ color: 'rgba(238,241,246,0.22)', textDecoration: 'none' }}>Editorial Policy</Link>
            <Link href="/sources" style={{ color: 'rgba(238,241,246,0.22)', textDecoration: 'none' }}>Sources</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
