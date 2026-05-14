'use client'

import { HeroSection }       from './HeroSection'
import { StatusStrip }       from './StatusStrip'
import { LatestNewsSection } from './LatestNewsSection'
import { MissionsSection }   from './MissionsSection'
import { LearnSection }      from './LearnSection'
import { AboutSection }      from './AboutSection'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <StatusStrip />
      <div className="glow-divider" />
      <div className="page-container">
        <LatestNewsSection />
        <MissionsSection />
        <LearnSection />
        <AboutSection />
      </div>
    </>
  )
}
