'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search } from 'lucide-react'
import { mainNav } from '@/config/navigation'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[60px] flex items-center justify-between px-12 border-b border-white/[0.06]" style={{ background: 'rgba(7,9,12,0.88)', backdropFilter: 'blur(24px)' }}>

      <Link href="/" className="flex items-baseline gap-[2px] no-underline">
        <span className="font-serif text-[21px] font-normal tracking-[0.03em]" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
          {siteConfig.name}
        </span>
        <span className="text-[11px] font-light tracking-[0.05em] ml-[1px]" style={{ fontFamily: 'DM Mono, monospace', color: '#3b9eff' }}>
          {siteConfig.tld}
        </span>
      </Link>

      <ul className="flex items-center gap-9 list-none m-0 p-0">
        {mainNav.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href))

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="no-underline transition-colors duration-200"
                style={{
                  fontFamily:    'DM Mono, monospace',
                  fontSize:      '11px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: item.isLive
                    ? '#34d897'
                    : isActive
                    ? '#eef1f6'
                    : 'rgba(238,241,246,0.5)',
                }}
              >
                {item.isLive && (
                  <span style={{
                    display:      'inline-block',
                    width:        '5px',
                    height:       '5px',
                    borderRadius: '50%',
                    background:   '#34d897',
                    boxShadow:    '0 0 8px #34d897',
                    marginRight:  '7px',
                    verticalAlign:'middle',
                    animation:    'blink 2s ease-in-out infinite',
                  }} />
                )}
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>

      <Link
        href="/search"
        className="flex items-center gap-2 no-underline transition-colors"
        style={{
          padding:       '7px 14px',
          border:        '1px solid rgba(255,255,255,0.06)',
          borderRadius:  '5px',
          background:    '#10151c',
          color:         'rgba(238,241,246,0.22)',
          fontFamily:    'DM Mono, monospace',
          fontSize:      '10px',
          letterSpacing: '0.1em',
        }}
      >
        <Search size={11} />
        <span>Search</span>
        <span style={{
          marginLeft:   '8px',
          background:   '#151c26',
          borderRadius: '3px',
          padding:      '1px 5px',
          fontSize:     '9px',
        }}>⌘K</span>
      </Link>

    </nav>
  )
}
