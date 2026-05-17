import { NextResponse } from 'next/server'

// GET /api/iss — proxies ISS position to avoid CORS issues
export async function GET() {
  try {
    const [posRes, crewRes] = await Promise.all([
      fetch('https://api.open-notify.org/iss-now.json', { cache: 'no-store' }),
      fetch('https://api.open-notify.org/astros.json',  { next: { revalidate: 3600 } }),
    ])

    if (!posRes.ok || !crewRes.ok) {
      throw new Error('ISS API error')
    }

    const posData  = await posRes.json()
    const crewData = await crewRes.json()

    return NextResponse.json({
      position: {
        latitude:  parseFloat(posData.iss_position.latitude),
        longitude: parseFloat(posData.iss_position.longitude),
        altitude:  408,
        velocity:  27600,
        timestamp: posData.timestamp,
      },
      crew: (crewData.people as any[]).filter(p => p.craft === 'ISS'),
    })

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'ISS API failed' },
      { status: 500 }
    )
  }
    }
