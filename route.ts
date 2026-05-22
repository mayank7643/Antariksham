import { NextRequest, NextResponse } from 'next/server'
import {
  createAdminMission, updateAdminMission,
  deleteAdminMission, getAdminMissionById,
} from '@/modules/admin/services/adminMissions'

const AUTH_COOKIE = 'antariksham_admin'

function isAuthed(req: NextRequest): boolean {
  return req.cookies.get(AUTH_COOKIE)?.value === process.env.ADMIN_PASSWORD
}

export async function POST(request: NextRequest) {
  if (!isAuthed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body   = await request.json()
    const result = await createAdminMission(buildPayload(body))
    if (!result) return NextResponse.json({ error: 'Failed to create mission' }, { status: 500 })
    return NextResponse.json({ id: result.id }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAuthed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  try {
    const body = await request.json()
    const ok   = await updateAdminMission(id, buildPayload(body))
    if (!ok) return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  try {
    const ok = await deleteAdminMission(id)
    if (!ok) return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

function buildPayload(body: any) {
  return {
    name:          String(body.name        || '').trim(),
    slug:          String(body.slug        || '').trim(),
    description:   String(body.description || '').trim(),
    agencyId:      body.agencyId     || null,
    status:        body.status       || 'upcoming',
    missionType:   body.missionType  || 'robotic',
    destination:   String(body.destination || '').trim(),
    launchDate:    body.launchDate   || null,
    featuredImage: body.featuredImage || null,
    featured:      Boolean(body.featured),
    timeline:      Array.isArray(body.timeline) ? body.timeline : [],
  }
}
