'use client'

import Link from 'next/link'
import { useState } from 'react'
import { siteConfig } from '@/config/site'
import { mainNav } from '@/config/navigation'

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', background: 'rgba(7,9,12,0.95)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>

        {/* LOGO */}
        <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: '2px', textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: '22px', fontWeight: 400, color: '#ffffff' }}>
            {siteConfig.name}
          </span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#3b9eff', marginLeft: '1px' }}>
            {siteConfig.tld}
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <ul style={{ display: 'flex', alignItems: 'center', gap: '32px', listStyle: 'none', margin: 0, padding: 0, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }} className="desktop-nav">
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', color: item.isLive ? '#34d897' : 'rgba(240,244,250,0.8)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {item.isLive && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#34d897', boxShadow: '0 0 6px #34d897', display: 'inline-block' }} />}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* HAMBURGER */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '8px 10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}
          className="mobile-menu-btn"
        >
          <span style={{ width: '18px', height: '1.5px', background: '#ffffff', display: 'block' }} />
          <span style={{ width: '18px', height: '1.5px', background: '#ffffff', display: 'block' }} />
          <span style={{ width: '18px', height: '1.5px', background: '#ffffff', display: 'block' }} />
        </button>

      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div style={{ position: 'fixed', top: '60px', left: 0, right: 0, bottom: 0, zIndex: 49, background: 'rgba(7,9,12,0.98)', backdropFilter: 'blur(24px)', display: 'flex', flexDirection: 'column', padding: '32px 24px' }}>
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: '28px', fontWeight: 300, color: item.isLive ? '#34d897' : '#ffffff', textDecoration: 'none', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '12px' }}
            >
              {item.isLive && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d897', boxShadow: '0 0 8px #34d897', display: 'inline-block', flexShrink: 0 }} />}
              {item.label}
            </Link>
          ))}
          <Link href="/search" onClick={() => setMenuOpen(false)} style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: '28px', fontWeight: 300, color: 'rgba(240,244,250,0.6)', textDecoration: 'none', padding: '14px 0', marginTop: '8px' }}>
            Search
          </Link>
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </>
  )
}
