'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter }             from 'next/navigation'
import { slugify, readingTime }  from '@/lib/utils'
import type {
  ArticleStatus, ArticleType, ArticleCategory,
} from '@/types/article'
import type {
  AdminArticleFull,
  CategoryOption,
  TagOption,
  AuthorOption,
} from '@/modules/admin/services/adminArticles'
import {
  Save, Eye, Globe, ChevronDown, X, Plus, AlertCircle, Languages,
} from 'lucide-react'
import { MediaLibrary } from '@/modules/admin/components/MediaLibrary'
import {
  SUPPORTED_LANGS, EMPTY_TRANSLATION,
  type SupportedLang, type TranslationFormState, type ArticleTranslation,
} from '@/types/translations'

// ── Constants ─────────────────────────────────────────────────

const ARTICLE_TYPES: { value: ArticleType; label: string }[] = [
  { value: 'breaking-news',      label: 'Breaking News'      },
  { value: 'analysis',           label: 'Analysis'           },
  { value: 'editorial',          label: 'Editorial'          },
  { value: 'mission-update',     label: 'Mission Update'     },
  { value: 'research-breakdown', label: 'Research Breakdown' },
  { value: 'explainer',          label: 'Explainer'          },
  { value: 'guide',              label: 'Guide'              },
]

// ── Types ─────────────────────────────────────────────────────

interface FormState {
  slug:               string
  featuredImage:      string
  authorId:           string
  status:             ArticleStatus
  articleType:        ArticleType
  featured:           boolean
  categoryIds:        string[]
  tagIds:             string[]
  _showMediaPicker:   boolean
}

interface Props {
  mode:       'new' | 'edit'
  article?:   AdminArticleFull
  categories: CategoryOption[]
  tags:       TagOption[]
  authors:    AuthorOption[]
}

// ── Component ─────────────────────────────────────────────────

export function ArticleForm({ mode, article, categories, tags, authors }: Props) {
  const router = useRouter()

  // ── Shared article fields ──────────────────────────────────

  const [form, setForm] = useState<FormState>({
    slug:          article?.slug          || '',
    featuredImage: article?.featuredImage || '',
    authorId:      article?.authorId      || '',
    status:        article?.status        || 'draft',
    articleType:   article?.articleType   || 'explainer',
    featured:      article?.featured      || false,
    _showMediaPicker: false,
    categoryIds:   article?.categoryIds   || [],
    tagIds:        article?.tagIds        || [],
  })

  const [saving,     setSaving]     = useState(false)
  const [error,      setError]      = useState('')
  const [success,    setSuccess]    = useState('')
  const [slugEdited, setSlugEdited] = useState(mode === 'edit')

  // ── Translation state ──────────────────────────────────────

  const [activeLang,     setActiveLang]     = useState<SupportedLang>('en')
  const [translations,   setTranslations]   = useState<Record<SupportedLang, TranslationFormState>>({
    en: { ...EMPTY_TRANSLATION },
    hi: { ...EMPTY_TRANSLATION },
  })
  const [existingTrans,  setExistingTrans]  = useState<Record<SupportedLang, ArticleTranslation | null>>({ en: null, hi: null })
  const [transSaving,    setTransSaving]    = useState(false)
  const [transSuccess,   setTransSuccess]   = useState<SupportedLang | null>(null)
  const [transError,     setTransError]     = useState('')
  const [transLoading,   setTransLoading]   = useState(false)
  const fetchTransRef = useRef<() => Promise<void>>(async () => {})

  // Load existing translations for edit mode
  fetchTransRef.current = async () => {
    if (mode !== 'edit' || !article?.id) return
    setTransLoading(true)
    try {
      const res  = await fetch(`/api/admin/translations?articleId=${article.id}`)
      const data = await res.json()
      if (!res.ok) return
      const existing: Record<SupportedLang, ArticleTranslation | null> = { en: null, hi: null }
      const forms:    Record<SupportedLang, TranslationFormState>      = {
        en: { ...EMPTY_TRANSLATION },
        hi: { ...EMPTY_TRANSLATION },
      }
      for (const t of data.translations as ArticleTranslation[]) {
        existing[t.lang] = t
        forms[t.lang] = {
          title:   t.title   || '',
          excerpt: t.excerpt || '',
          content: t.content || '',
        }
      }
      setExistingTrans(existing)
      setTranslations(forms)
    } finally {
      setTransLoading(false)
    }
  }

  useEffect(() => { fetchTransRef.current() }, [])

  // ── Helpers ────────────────────────────────────────────────

  function setTrans(lang: SupportedLang, key: keyof TranslationFormState, val: string) {
    setTranslations(prev => ({ ...prev, [lang]: { ...prev[lang], [key]: val } }))
    setTransError('')
  }

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm(f => ({ ...f, [key]: val }))
    setError('')
  }

  function toggleCategory(id: string) {
    setForm(f => ({
      ...f,
      categoryIds: f.categoryIds.includes(id)
        ? f.categoryIds.filter(c => c !== id)
        : [...f.categoryIds, id],
    }))
  }

  function toggleTag(id: string) {
    setForm(f => ({
      ...f,
      tagIds: f.tagIds.includes(id)
        ? f.tagIds.filter(t => t !== id)
        : [...f.tagIds, id],
    }))
  }

  // ── Save article (shared fields) ──────────────────────────

  async function handleSave(saveStatus: ArticleStatus) {
    const enTrans = translations['en']
    if (!enTrans.title.trim())   { setError('English title is required.');   return }
    if (!form.slug.trim())       { setError('Slug is required.');             return }
    if (!enTrans.content.trim()) { setError('English content is required.');  return }

    setSaving(true)
    setError('')
    setSuccess('')

    const payload = {
      // For backwards-compatibility, also write EN values to articles table columns
      title:         enTrans.title,
      excerpt:       enTrans.excerpt,
      content:       enTrans.content,
      slug:          form.slug,
      featuredImage: form.featuredImage || null,
      authorId:      form.authorId      || null,
      status:        saveStatus,
      articleType:   form.articleType,
      featured:      form.featured,
      categoryIds:   form.categoryIds,
      tagIds:        form.tagIds,
      readingTime:   readingTime(enTrans.content),
    }

    try {
      const url    = mode === 'edit' ? `/api/admin/articles?id=${article!.id}` : '/api/admin/articles'
      const method = mode === 'edit' ? 'PATCH' : 'POST'

      const res  = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) { setError(data.error || 'Failed to save article.'); return }

      setSuccess(saveStatus === 'published' ? 'Published!' : 'Saved as draft.')

      if (mode === 'new') {
        router.push(`/admin/articles/${data.id}`)
      } else {
        router.refresh()
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setSaving(false)
    }
  }

  // ── Save translation ───────────────────────────────────────

  async function handleSaveTranslation(lang: SupportedLang) {
    if (mode === 'new' || !article?.id) {
      setTransError('Save the article first before adding translations.')
      return
    }
    const t = translations[lang]
    if (!t.title.trim()) {
      setTransError(`Title is required for the ${lang === 'hi' ? 'Hindi' : 'English'} translation.`)
      return
    }

    setTransSaving(true)
    setTransError('')

    const existing = existingTrans[lang]
    const url      = existing ? `/api/admin/translations?id=${existing.id}` : '/api/admin/translations'
    const method   = existing ? 'PATCH' : 'POST'
    const body     = existing
      ? { title: t.title, excerpt: t.excerpt, content: t.content }
      : { articleId: article.id, lang, title: t.title, excerpt: t.excerpt, content: t.content }

    try {
      const res  = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { setTransError(data.error || 'Failed to save translation.'); return }

      setTransSuccess(lang)
      setTimeout(() => setTransSuccess(null), 3000)
      // Refresh so existingTrans is updated
      fetchTransRef.current()
    } catch {
      setTransError('Something went wrong. Try again.')
    } finally {
      setTransSaving(false)
    }
  }

  const activeTrans  = translations[activeLang]
  const wordCount    = activeTrans.content.trim().split(/\s+/).filter(Boolean).length
  const rt           = readingTime(activeTrans.content)

  // ── Render ──────────────────────────────────────────────────

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' }}>

      {/* ── Left: main content ────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* ── Language tabs ────────────────────────── */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>

          {/* Tab header */}
          <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', borderRight: '1px solid var(--border)' }}>
              <Languages size={12} style={{ color: 'rgba(240,244,250,0.4)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,244,250,0.4)' }}>
                Language
              </span>
            </div>
            {SUPPORTED_LANGS.map(lang => {
              const isActive   = activeLang === lang.code
              const hasContent = translations[lang.code].title.trim().length > 0
              const hasExisting = existingTrans[lang.code] !== null
              return (
                <button
                  key={lang.code}
                  onClick={() => setActiveLang(lang.code)}
                  style={{
                    padding:       '10px 18px',
                    background:    isActive ? 'rgba(59,158,255,0.08)' : 'transparent',
                    border:        'none',
                    borderRight:   '1px solid var(--border)',
                    borderBottom:  isActive ? '2px solid var(--accent)' : '2px solid transparent',
                    color:         isActive ? 'var(--accent)' : 'rgba(240,244,250,0.5)',
                    fontFamily:    'var(--font-mono)',
                    fontSize:      '11px',
                    letterSpacing: '0.1em',
                    cursor:        'pointer',
                    display:       'flex',
                    alignItems:    'center',
                    gap:           '7px',
                    transition:    'all 0.15s',
                  }}
                >
                  {lang.nativeLabel}
                  {/* Status dot */}
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                    background: hasExisting ? 'var(--green)' : hasContent ? 'var(--gold)' : 'rgba(240,244,250,0.15)',
                  }} title={hasExisting ? 'Saved' : hasContent ? 'Unsaved changes' : 'Empty'} />
                </button>
              )
            })}
            {/* Legend */}
            <div style={{ marginLeft: 'auto', padding: '0 14px', display: 'flex', gap: '12px' }}>
              {[
                { color: 'var(--green)', label: 'Saved'    },
                { color: 'var(--gold)',  label: 'Unsaved'  },
                { color: 'rgba(240,244,250,0.15)', label: 'Empty' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(240,244,250,0.3)', letterSpacing: '0.08em' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div style={{ padding: '20px' }}>

            {transLoading ? (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(240,244,250,0.3)', margin: 0, letterSpacing: '0.1em' }}>
                Loading translations…
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                {/* Title */}
                <div>
                  <FieldLabel>
                    {activeLang === 'hi' ? 'शीर्षक (Title)' : 'Title'}
                  </FieldLabel>
                  <input
                    value={activeTrans.title}
                    onChange={e => {
                      setTrans(activeLang, 'title', e.target.value)
                      // Auto-generate slug from EN title only
                      if (activeLang === 'en' && !slugEdited) {
                        setForm(f => ({ ...f, slug: slugify(e.target.value) }))
                      }
                    }}
                    placeholder={activeLang === 'hi' ? 'लेख का शीर्षक…' : 'Article title…'}
                    style={inputStyle({ large: true })}
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <FieldLabel hint={`${activeTrans.excerpt.length}/300`}>
                    {activeLang === 'hi' ? 'सारांश (Excerpt)' : 'Excerpt'}
                  </FieldLabel>
                  <textarea
                    value={activeTrans.excerpt}
                    onChange={e => setTrans(activeLang, 'excerpt', e.target.value)}
                    placeholder={activeLang === 'hi' ? 'संक्षिप्त विवरण…' : 'Short summary shown in article cards…'}
                    rows={3}
                    maxLength={300}
                    style={{ ...inputStyle({}), resize: 'vertical', lineHeight: 1.6 }}
                  />
                </div>

                {/* Content */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                    <FieldLabel>
                      {activeLang === 'hi' ? 'सामग्री — Content (HTML)' : 'Content (HTML)'}
                    </FieldLabel>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', color: 'rgba(240,244,250,0.3)' }}>
                      {wordCount} words · {rt} min read
                    </span>
                  </div>
                  <textarea
                    value={activeTrans.content}
                    onChange={e => setTrans(activeLang, 'content', e.target.value)}
                    placeholder={activeLang === 'hi'
                      ? '<p>यहाँ लेख लिखें…</p>'
                      : '<p>Start writing your article…</p>\n\n<p>Use standard HTML for formatting.</p>'
                    }
                    rows={22}
                    style={{ ...inputStyle({}), resize: 'vertical', lineHeight: 1.7, fontFamily: 'var(--font-mono)', fontSize: '12px' }}
                  />
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(240,244,250,0.3)', margin: '6px 0 0', letterSpacing: '0.06em' }}>
                    Content is rendered as HTML. Use &lt;p&gt;, &lt;h2&gt;–&lt;h4&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;a href=""&gt;, &lt;ul&gt;&lt;li&gt;, &lt;blockquote&gt;.
                  </p>
                </div>

                {/* Translation save row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '4px' }}>
                  <button
                    onClick={() => handleSaveTranslation(activeLang)}
                    disabled={transSaving || mode === 'new'}
                    title={mode === 'new' ? 'Save the article first' : undefined}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--border)',
                      background: 'rgba(255,255,255,0.04)', color: 'rgba(240,244,250,0.7)',
                      fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em',
                      textTransform: 'uppercase', cursor: transSaving || mode === 'new' ? 'not-allowed' : 'pointer',
                      opacity: mode === 'new' ? 0.4 : 1, transition: 'all 0.15s',
                    }}
                  >
                    <Languages size={11} />
                    {transSaving
                      ? 'Saving…'
                      : existingTrans[activeLang]
                        ? `Update ${activeLang.toUpperCase()} Translation`
                        : `Save ${activeLang.toUpperCase()} Translation`
                    }
                  </button>

                  {transSuccess === activeLang && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--green)', letterSpacing: '0.08em' }}>
                      ✓ Saved
                    </span>
                  )}
                  {transError && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--red)', letterSpacing: '0.06em' }}>
                      {transError}
                    </span>
                  )}
                  {mode === 'new' && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(240,244,250,0.25)', letterSpacing: '0.06em' }}>
                      Save article first to enable translations
                    </span>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Slug — shared field, auto-generated from EN title */}
        <div>
          <FieldLabel hint={`/news/${form.slug || '…'}`}>Slug (shared across languages)</FieldLabel>
          <input
            value={form.slug}
            onChange={e => { setSlugEdited(true); set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-')) }}
            placeholder="url-friendly-slug"
            style={inputStyle({})}
          />
        </div>

        {/* Featured image — shared field */}
        <div>
          <FieldLabel hint="Shared across all languages">Featured Image</FieldLabel>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
            <input
              value={form.featuredImage}
              onChange={e => set('featuredImage', e.target.value)}
              placeholder="https://… or pick from Media Library →"
              style={{ ...inputStyle({}), flex: 1 }}
            />
            <button
              type="button"
              onClick={() => set('_showMediaPicker', !form._showMediaPicker)}
              style={{
                flexShrink:    0,
                padding:       '0 14px',
                background:    form._showMediaPicker ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                border:        '1px solid',
                borderColor:   form._showMediaPicker ? 'var(--accent)' : 'rgba(255,255,255,0.12)',
                borderRadius:  '6px',
                color:         form._showMediaPicker ? '#07090c' : 'rgba(240,244,250,0.7)',
                fontFamily:    'var(--font-mono)',
                fontSize:      '10px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor:        'pointer',
                whiteSpace:    'nowrap',
                transition:    'all 0.15s',
              }}
            >
              {form._showMediaPicker ? '✕ Close' : '📁 Browse'}
            </button>
          </div>

          {form._showMediaPicker && (
            <div style={{ marginTop: '12px', padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '10px' }}>
              <MediaLibrary
                pickerMode
                defaultBucket="article-images"
                onPick={url => {
                  set('featuredImage', url)
                  set('_showMediaPicker', false)
                }}
              />
            </div>
          )}

          {form.featuredImage && !form._showMediaPicker && (
            <div style={{ marginTop: '10px', borderRadius: '8px', overflow: 'hidden', aspectRatio: '16/5', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <img
                src={form.featuredImage}
                alt="preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </div>
          )}
        </div>

      </div>

      {/* ── Right: sidebar controls ───────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '24px' }}>

        {/* Error / success */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(240,90,90,0.08)', border: '1px solid rgba(240,90,90,0.25)', borderRadius: '7px' }}>
            <AlertCircle size={13} style={{ color: 'var(--red)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--red)' }}>{error}</span>
          </div>
        )}
        {success && (
          <div style={{ padding: '10px 14px', background: 'rgba(52,216,151,0.08)', border: '1px solid rgba(52,216,151,0.25)', borderRadius: '7px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--green)' }}>
            ✓ {success}
          </div>
        )}

        {/* Publish actions */}
        <SidePanel label="Publish">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button onClick={() => handleSave('published')} disabled={saving} style={btnStyle({ primary: true, disabled: saving })}>
              <Globe size={12} />
              {saving ? 'Publishing…' : 'Publish'}
            </button>
            <button onClick={() => handleSave('draft')} disabled={saving} style={btnStyle({ disabled: saving })}>
              <Save size={12} />
              Save as Draft
            </button>
            {mode === 'edit' && article?.slug && (
              <>
                <a href={`/news/${article.slug}`} target="_blank" rel="noopener noreferrer" style={{ ...btnStyle({}), textDecoration: 'none', textAlign: 'center' as const, justifyContent: 'center' }}>
                  <Eye size={12} /> View EN
                </a>
                <a href={`/news/hi/${article.slug}`} target="_blank" rel="noopener noreferrer" style={{ ...btnStyle({}), textDecoration: 'none', textAlign: 'center' as const, justifyContent: 'center' }}>
                  <Eye size={12} /> View HI
                </a>
              </>
            )}
          </div>
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,244,250,0.3)' }}>
              Status:
            </span>
            <span style={{
              marginLeft: '6px', fontFamily: 'var(--font-mono)', fontSize: '9px',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: form.status === 'published' ? 'var(--green)'
                   : form.status === 'draft'     ? 'var(--gold)'
                   : 'rgba(240,244,250,0.4)',
            }}>
              {form.status}
            </span>
          </div>
        </SidePanel>

        {/* Translations status panel */}
        <SidePanel label="Translations">
          {SUPPORTED_LANGS.map(lang => {
            const exists  = existingTrans[lang.code] !== null
            const hasText = translations[lang.code].title.trim().length > 0
            return (
              <div key={lang.code} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(240,244,250,0.6)' }}>
                  {lang.nativeLabel} ({lang.code.toUpperCase()})
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em',
                  textTransform: 'uppercase', padding: '2px 7px', borderRadius: '4px',
                  background: exists ? 'rgba(52,216,151,0.1)' : hasText ? 'rgba(201,169,110,0.1)' : 'rgba(255,255,255,0.04)',
                  color: exists ? 'var(--green)' : hasText ? 'var(--gold)' : 'rgba(240,244,250,0.25)',
                  border: `1px solid ${exists ? 'rgba(52,216,151,0.2)' : hasText ? 'rgba(201,169,110,0.2)' : 'var(--border)'}`,
                }}>
                  {exists ? 'Saved' : hasText ? 'Draft' : 'Empty'}
                </span>
              </div>
            )
          })}
        </SidePanel>

        {/* Article type */}
        <SidePanel label="Article Type">
          <div style={{ position: 'relative' }}>
            <select value={form.articleType} onChange={e => set('articleType', e.target.value as ArticleType)} style={{ ...inputStyle({}), paddingRight: '28px', appearance: 'none', cursor: 'pointer' }}>
              {ARTICLE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <ChevronDown size={12} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,244,250,0.4)', pointerEvents: 'none' }} />
          </div>
        </SidePanel>

        {/* Author */}
        <SidePanel label="Author">
          <div style={{ position: 'relative' }}>
            <select value={form.authorId} onChange={e => set('authorId', e.target.value)} style={{ ...inputStyle({}), paddingRight: '28px', appearance: 'none', cursor: 'pointer' }}>
              <option value="">— No author —</option>
              {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <ChevronDown size={12} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,244,250,0.4)', pointerEvents: 'none' }} />
          </div>
        </SidePanel>

        {/* Featured toggle */}
        <SidePanel label="Options">
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <div
              onClick={() => set('featured', !form.featured)}
              style={{
                width: '32px', height: '18px', borderRadius: '9px',
                background: form.featured ? 'var(--accent)' : 'var(--raised)',
                border: `1px solid ${form.featured ? 'var(--accent)' : 'var(--border-hi)'}`,
                position: 'relative', transition: 'all 0.2s', cursor: 'pointer', flexShrink: 0,
              }}
            >
              <div style={{
                position: 'absolute', top: '2px',
                left: form.featured ? '14px' : '2px',
                width: '12px', height: '12px', borderRadius: '50%',
                background: form.featured ? '#07090c' : 'rgba(240,244,250,0.4)',
                transition: 'left 0.2s',
              }} />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(240,244,250,0.6)' }}>
              Featured article
            </span>
          </label>
        </SidePanel>

        {/* Categories */}
        <SidePanel label={`Categories ${form.categoryIds.length > 0 ? `(${form.categoryIds.length})` : ''}`}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {categories.map(cat => {
              const active = form.categoryIds.includes(cat.id)
              return (
                <button key={cat.id} onClick={() => toggleCategory(cat.id)} style={{ padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', background: active ? 'rgba(59,158,255,0.15)' : 'transparent', border: `1px solid ${active ? 'rgba(59,158,255,0.5)' : 'var(--border)'}`, color: active ? 'var(--accent)' : 'rgba(240,244,250,0.5)', transition: 'all 0.15s' }}>
                  {cat.name}
                </button>
              )
            })}
          </div>
        </SidePanel>

        {/* Tags */}
        <SidePanel label={`Tags ${form.tagIds.length > 0 ? `(${form.tagIds.length})` : ''}`}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '130px', overflowY: 'auto' }}>
            {tags.map(tag => {
              const active = form.tagIds.includes(tag.id)
              return (
                <button key={tag.id} onClick={() => toggleTag(tag.id)} style={{ padding: '3px 9px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', background: active ? 'rgba(201,169,110,0.12)' : 'transparent', border: `1px solid ${active ? 'rgba(201,169,110,0.4)' : 'var(--border)'}`, color: active ? 'var(--gold)' : 'rgba(240,244,250,0.4)', transition: 'all 0.15s' }}>
                  {tag.name}
                </button>
              )
            })}
          </div>
        </SidePanel>

      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────

function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '6px' }}>
      <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(240,244,250,0.5)' }}>
        {children}
      </label>
      {hint && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(240,244,250,0.3)', letterSpacing: '0.04em' }}>
          {hint}
        </span>
      )}
    </div>
  )
}

function SidePanel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,244,250,0.4)' }}>
          {label}
        </span>
      </div>
      <div style={{ padding: '12px 14px' }}>
        {children}
      </div>
    </div>
  )
}

// ── Style helpers ─────────────────────────────────────────────

function inputStyle({ large }: { large?: boolean }) {
  return {
    width:        '100%',
    padding:      large ? '12px 14px' : '9px 12px',
    background:   '#0b0e13',
    border:       '1px solid var(--border)',
    borderRadius: '7px',
    color:        '#f0f4fa',
    fontFamily:   large ? 'var(--font-serif)' : 'var(--font-sans)',
    fontSize:     large ? '20px' : '13px',
    outline:      'none',
    boxSizing:    'border-box' as const,
    display:      'block',
    transition:   'border-color 0.2s',
  }
}

function btnStyle({ primary, disabled }: { primary?: boolean; disabled?: boolean }) {
  return {
    display:        'inline-flex' as const,
    alignItems:     'center' as const,
    justifyContent: 'center' as const,
    gap:            '6px',
    width:          '100%',
    padding:        '9px 14px',
    borderRadius:   '6px',
    fontFamily:     'var(--font-mono)' as const,
    fontSize:       '11px',
    letterSpacing:  '0.1em',
    textTransform:  'uppercase' as const,
    fontWeight:     primary ? 700 : 400,
    cursor:         disabled ? 'not-allowed' : 'pointer',
    opacity:        disabled ? 0.6 : 1,
    background:     primary ? 'var(--accent)' : 'var(--surface)',
    color:          primary ? '#07090c' : 'rgba(240,244,250,0.7)',
    border:         primary ? 'none' : '1px solid var(--border-hi)',
    transition:     'all 0.15s',
  }
}
