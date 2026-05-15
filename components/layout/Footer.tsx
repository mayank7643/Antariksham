import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { footerNav } from '@/config/navigation'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: '#0b0e13', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '64px 48px 40px' }}>
      <div style={{ maxWidth: '1380px', margin: '0 auto' }}>

        {/* TOP GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: '60px', marginBottom: '56px' }}>

          {/* BRAND */}
          <div>
            <div style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: '24px', fontWeight: 400, color: '#ffffff', letterSpacing: '0.02em', marginBottom: '6px' }}>
              {siteConfig.name}
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '14px', color: '#3b9eff', marginLeft: '2px' }}>{siteConfig.tld}</span>
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3b9eff', marginBottom: '20px', opacity: 0.8 }}>
              {siteConfig.positioning}
            </div>
            <p style={{ fontSize: '15px', fontWeight: 400, color: 'rgba(240,244,250,0.75)', lineHeight: 1.7, maxWidth: '260px', marginBottom: '28px' }}>
              {siteConfig.description}
            </p>
            <Link href="/about" style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#ffffff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              About Our Mission →
            </Link>
          </div>

          {/* PLATFORM */}
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(240,244,250,0.5)', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              Platform
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {footerNav.platform.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} style={{ fontSize: '15px', fontWeight: 400, color: 'rgba(240,244,250,0.85)', textDecoration: 'none' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* INTELLIGENCE */}
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(240,244,250,0.5)', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              Intelligence
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {footerNav.intelligence.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} style={{ fontSize: '15px', fontWeight: 400, color: 'rgba(240,244,250,0.85)', textDecoration: 'none' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ORGANIZATION */}
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(240,244,250,0.5)', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              Organization
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {footerNav.organization.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} style={{ fontSize: '15px', fontWeight: 400, color: 'rgba(240,244,250,0.85)', textDecoration: 'none' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div style={{ paddingTop: '28px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <span style={{ fontSize: '14px', color: 'rgba(240,244,250,0.6)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.06em' }}>
            © {year} {siteConfig.domain} — Independent Space Intelligence Organization
          </span>
          <div style={{ display: 'flex', gap: '28px' }}>
            {[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Editorial Policy', href: '/editorial-policy' },
              { label: 'Sources & Licensing', href: '/sources' },
              { label: 'Contact', href: '/contact' },
            ].map((item) => (
              <Link key={item.href} href={item.href} style={{ fontSize: '13px', color: 'rgba(240,244,250,0.6)', textDecoration: 'none', fontFamily: 'DM Mono, monospace', letterSpacing: '0.06em' }}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
