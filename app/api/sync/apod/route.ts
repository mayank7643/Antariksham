import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// POST /api/sync/apod
// Fetches today's NASA APOD and caches it in Supabase live_data table
// Protected by CRON_SECRET — call this daily via cron or manually

export async function POST(req: Request) {
  // Verify secret to prevent unauthorized syncs
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const NASA_KEY = process.env.NASA_API_KEY
  if (!NASA_KEY) {
    return NextResponse.json({ error: 'NASA_API_KEY not set' }, { status: 500 })
  }

  try {
    // Fetch from NASA APOD API
    const res  = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`,
      { cache: 'no-store' }
    )

    if (!res.ok) {
      throw new Error(`NASA API error: ${res.status}`)
    }

    const apod = await res.json()

    // Save to Supabase live_data table
    const db = supabaseAdmin()
    const { error } = await db
      .from('live_data')
      .upsert({
        key:        'apod_today',
        value:      apod,
        synced_at:  new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }, { onConflict: 'key' })

    if (error) throw error

    return NextResponse.json({
      success: true,
      title:   apod.title,
      date:    apod.date,
      media:   apod.media_type,
    })

  } catch (err: any) {
    console.error('APOD sync error:', err)
    return NextResponse.json(
      { error: err.message || 'Sync failed' },
      { status: 500 }
    )
  }
}

// GET /api/sync/apod — returns current cached APOD from Supabase
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')

  if (secret === process.env.CRON_SECRET) {
    // Reuse POST logic via internal fetch
    return POST(new Request(req.url, {
      method: 'POST',
      headers: { 'x-cron-secret': secret },
    }))
  }

  // No secret — return cached APOD
  const db = supabaseAdmin()
  const { data, error } = await db
    .from('live_data')
    .select('value, synced_at')
    .eq('key', 'apod_today')
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'No APOD cached yet' }, { status: 404 })
  }

  return NextResponse.json({ apod: data.value, synced_at: data.synced_at })
}
  const db = supabaseAdmin()
  const { data, error } = await db
    .from('live_data')
    .select('value, synced_at')
    .eq('key', 'apod_today')
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'No APOD cached yet' }, { status: 404 })
  }

  return NextResponse.json({
    apod:      data.value,
    synced_at: data.synced_at,
  })
}
