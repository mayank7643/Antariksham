import type { Metadata }         from 'next'
import { siteConfig }            from '@/config/site'
import { getDeepSpaceProbes }    from '@/modules/deepspace/services/getDeepSpace'
import { DeepSpaceTracker }      from '@/modules/deepspace/components/DeepSpaceTracker'

export const revalidate = 3600 // 1 hour

export const metadata: Metadata = {
  title:       `Deep Space Tracker — ${siteConfig.name}`,
  description: 'Live telemetry for Voyager 1, Voyager 2, Parker Solar Probe, Europa Clipper and Lucy — distance, velocity and signal delay from NASA Horizons.',
}

export default async function DeepSpacePage() {
  const { probes, updatedAt } = await getDeepSpaceProbes()

  return (
    <DeepSpaceTracker
      initialProbes={probes}
      updatedAt={updatedAt}
    />
  )
}
