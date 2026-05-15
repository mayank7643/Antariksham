'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search } from 'lucide-react'
import { mainNav } from '@/config/navigation'
import { siteConfig } from '@/config/site'

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', background: 'rgba(7,9,12,0.92)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>

      {/* LOGO */}
      <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: '2px', textDecoration: 'none' }}>
        <span style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: '24px', fontWeight: 400, letterSpacing: '0.03em', color: '#ffffff' }}>
          {siteConfig.name}
        </span>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '13px', fontWeight: 300, color: '#3b9eff', letterSpacing: '0.05em', marginLeft: '1px' }}>
          {siteConfig.tld}
        </span>
      </Link>

      {/* NAV LINKS */}
      <ul style={{ display: 'flex', alignItems: 'center', gap: '40px', listStyle: 'none', margin: 0, padding: 0 }}>
        {mainNav.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href))

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                style={{
                  fontFamily:    'DM Mono, monospace',
                  fontSize:      '13px',
                  fontWeight:    400,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  textDecoration:'none',
                  color: item.isLive
                    ? '#34d897'
                    : isActive
                    ? '#ffffff'
                    : 'rgba(240,244,250,0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                }}
              >
                {item.isLive && (
                  <span style={{
                    width: '6px', height: '6px',
                    borderRadius: '50%',
                    background: '#34d897',
                    boxShadow: '0 0 8px #34d897',
                    display: 'inline-block',
                    animation: 'blink 2s ease-in-out infinite',
                  }} />
                )}
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>

      {/* SEARCH */}
      <Link
        href="/search"
        style={{
          display:       'flex',
          alignItems:    'center',
          gap:           '8px',
          padding:       '9px 18px',
          border:        '1px solid rgba(255,255,255,0.2)',
          borderRadius:  '6px',
          background:    'rgba(255,255,255,0.05)',
          color:         'rgba(240,244,250,0.8)',
          fontFamily:    'DM Mono, monospace',
          fontSize:      '12px',
          letterSpacing: '0.1em',
          textDecoration:'none',
        }}
      >
        <Search size={13} />
        <span>Search</span>
        <span style={{ marginLeft: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', padding: '2px 6px', fontSize: '10px', color: 'rgba(240,244,250,0.6)' }}>⌘K</span>
      </Link>

    </nav>
  )
}
