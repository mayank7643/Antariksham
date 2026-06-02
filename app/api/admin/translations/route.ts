import { NextRequest, NextResponse }          from 'next/server'
import { supabaseAdmin }                       from '@/lib/supabase'
import { mapTranslationRow, SupportedLang }    from '@/types/translations'

export const dynamic = 'force-dynamic'

const AUTH_COOKIE     = 'antariksham_admin'
const SUPPORTED_LANGS = ['en', 'hi'] as const

function isAuthed(req: NextRequest): boolean {
  return req.cookies.get(AUTH_COOKIE)?.value === process.env.ADMIN_PASSWORD
}

// ── GET /api/admin/translations?articleId=xxx ─────────────────
// Returns all translation rows for a given article
export async function GET(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const articleId = req.nextUrl.searchParams.get('articleId')
  if (!articleId) {
    return NextResponse.json({ error: 'Missing articleId' }, { status: 400 })
  }

  try {
    const db = supabaseAdmin()
    const { data, error } = await db
      .from('article_translations')
      .select('*')
      .eq('article_id', articleId)
      .order('lang', { ascending: true })

    if (error) throw error

    return NextResponse.json({
      translations: (data || []).map(mapTranslationRow),
    })
  } catch (err: any) {
    console.error('translations get error:', err)
    return NextResponse.json({ error: err.message || 'Failed to fetch translations' }, { status: 500 })
  }
}

// ── POST /api/admin/translations — create translation row ──────
// Creates a new translation for an article+lang pair
// Returns 409 if that article+lang already exists (use PATCH to update)
export async function POST(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()

    const articleId = String(body.articleId || '').trim()
    const lang      = String(body.lang      || '').trim() as SupportedLang
    const payload   = buildPayload(body)

    if (!articleId) {
      return NextResponse.json({ error: 'articleId is required' }, { status: 400 })
    }
    if (!SUPPORTED_LANGS.includes(lang)) {
      return NextResponse.json({ error: `lang must be one of: ${SUPPORTED_LANGS.join(', ')}` }, { status: 400 })
    }
    if (!payload.title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 })
    }

    const db = supabaseAdmin()

    // Check article exists
    const { data: article, error: articleErr } = await db
      .from('articles')
      .select('id')
      .eq('id', articleId)
      .single()

    if (articleErr || !article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Insert — UNIQUE(article_id, lang) constraint will catch duplicates
    const { data, error } = await db
      .from('article_translations')
      .insert({
        article_id: articleId,
        lang,
        title:      payload.title,
        excerpt:    payload.excerpt,
        content:    payload.content,
        seo_id:     payload.seoId,
      })
      .select('*')
      .single()

    if (error) {
      // Postgres unique violation code
      if (error.code === '23505') {
        return NextResponse.json(
          { error: `A ${lang} translation already exists for this article. Use edit to update it.` },
          { status: 409 }
        )
      }
      throw error
    }

    return NextResponse.json({ translation: mapTranslationRow(data) }, { status: 201 })
  } catch (err: any) {
    console.error('translations create error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// ── PATCH /api/admin/translations?id=xxx — update row ─────────
export async function PATCH(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  try {
    const body    = await req.json()
    const payload = buildPayload(body)

    if (!payload.title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 })
    }

    const db = supabaseAdmin()
    const { error } = await db
      .from('article_translations')
      .update({
        title:      payload.title,
        excerpt:    payload.excerpt,
        content:    payload.content,
        seo_id:     payload.seoId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('translations update error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// ── DELETE /api/admin/translations?id=xxx — delete row ────────
export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  try {
    const db = supabaseAdmin()
    const { error } = await db
      .from('article_translations')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('translations delete error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// ── Helper ────────────────────────────────────────────────────

function buildPayload(body: any) {
  return {
    title:   String(body.title   || '').trim(),
    excerpt: String(body.excerpt || '').trim() || null,
    content: String(body.content || '').trim() || null,
    seoId:   String(body.seoId   || '').trim() || null,
  }
}
