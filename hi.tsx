import { notFound }        from 'next/navigation'
import { formatDate }      from '@/lib/utils'
import type { Metadata }   from 'next'
import { supabase }        from '@/lib/supabase'
import { getAllArticleSlugs, getRelatedArticles } from '@/modules/news/services/getArticles'

export const revalidate = 300

// ── Re-use EN slugs for static generation ────────────────────
export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs()
  return slugs.map(slug => ({ slug }))
}

// ── Data fetcher ──────────────────────────────────────────────

async function getHindiArticle(slug: string) {
  // 1. Get the base article (shared fields: image, author, dates, status)
  const { data: article, error: articleErr } = await supabase
    .from('articles')
    .select(`
      id, slug, featured_image, published_at, updated_at,
      reading_time, views, article_type, featured,
      authors ( id, name, bio, avatar ),
      article_categories ( categories ( name ) ),
      article_tags ( tags ( name ) ),
      seo_metadata ( meta_title, meta_description, og_image )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (articleErr || !article) return null

  // 2. Get the Hindi translation
  const { data: translation, error: transErr } = await supabase
    .from('article_translations')
    .select('id, title, excerpt, content')
    .eq('article_id', article.id)
    .eq('lang', 'hi')
    .single()

  // No Hindi translation exists yet — return null so we show a proper fallback
  if (transErr || !translation) return { article, translation: null }

  return { article, translation }
}

// ── Metadata ──────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const result = await getHindiArticle(params.slug)
  if (!result) return { title: 'Article Not Found' }

  const { article, translation } = result
  const title       = translation?.title   || article.seo_metadata?.meta_title   || 'Antariksham'
  const description = translation?.excerpt || article.seo_metadata?.meta_description || ''

  return {
    title,
    description,
    alternates: {
      canonical:  `/news/hi/${params.slug}`,
      languages:  { 'en': `/news/${params.slug}`, 'hi': `/news/hi/${params.slug}` },
    },
    openGraph: {
      title,
      description,
      images:        article.featured_image ? [article.featured_image] : [],
      type:          'article',
      publishedTime: article.published_at || undefined,
    },
  }
}

// ── Category colors ───────────────────────────────────────────

const CAT_COLORS: Record<string, string> = {
  NASA: '#3b9eff', SpaceX: '#9f7aea', ISRO: '#f97316',
  ESA: '#34d897', JAXA: '#c9a96e', Astronomy: '#3b9eff',
  Discoveries: '#34d897', Technology: '#9f7aea',
  Missions: '#c9a96e', Science: '#f0f4fa',
}

// ── Page ──────────────────────────────────────────────────────

export default async function HindiArticlePage(
  { params }: { params: { slug: string } }
) {
  const result = await getHindiArticle(params.slug)
  if (!result) notFound()

  const { article, translation } = result

  // Increment view count — shared counter for both languages
  supabase
    .from('articles')
    .update({ views: (article.views || 0) + 1 })
    .eq('id', article.id)
    .then(() => {})

  const categories = (article.article_categories || []).map((ac: any) => ac.categories?.name).filter(Boolean)
  const tags       = (article.article_tags       || []).map((at: any) => at.tags?.name).filter(Boolean)
  const readingTime = article.reading_time || 5

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: 'var(--nav-height)' }}>
      <article style={{
        maxWidth: '740px',
        margin:   '0 auto',
        padding:  'clamp(32px, 6vw, 64px) clamp(20px, 5vw, 40px)',
      }}>

        {/* Language toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
          <a
            href={`/news/${params.slug}`}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em',
              textTransform: 'uppercase', padding: '5px 12px', borderRadius: '5px',
              border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(240,244,250,0.45)',
              textDecoration: 'none', transition: 'all 0.15s',
            }}
          >
            EN — English
          </a>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em',
            textTransform: 'uppercase', padding: '5px 12px', borderRadius: '5px',
            border: '1px solid var(--accent)', color: 'var(--accent)',
            background: 'rgba(59,158,255,0.08)',
          }}>
            HI — हिन्दी ✓
          </span>
        </div>

        {/* No Hindi translation yet — helpful fallback */}
        {!translation ? (
          <div style={{
            background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.2)',
            borderRadius: '10px', padding: '32px', textAlign: 'center', marginBottom: '40px',
          }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--gold)', margin: '0 0 10px', fontWeight: 400 }}>
              हिन्दी अनुवाद उपलब्ध नहीं है
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(240,244,250,0.4)', letterSpacing: '0.08em', margin: '0 0 20px' }}>
              Hindi translation not yet available for this article.
            </p>
            <a
              href={`/news/${params.slug}`}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.15em',
                textTransform: 'uppercase', color: 'var(--accent)', textDecoration: 'none',
              }}
            >
              Read in English →
            </a>
          </div>
        ) : (
          <>
            {/* Breaking badge */}
            {article.article_type === 'breaking-news' && (
              <span style={{ display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#07090c', background: '#f05a5a', padding: '3px 8px', borderRadius: '3px', marginBottom: '20px' }}>
                ब्रेकिंग
              </span>
            )}

            {/* Categories */}
            {categories.length > 0 && (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {categories.map((cat: string) => (
                  <a key={cat} href="/news" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: CAT_COLORS[cat] || '#3b9eff', textDecoration: 'none' }}>
                    {cat}
                  </a>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 style={{
              fontFamily:    'var(--font-serif)',
              fontSize:      'clamp(28px, 4.5vw, 48px)',
              fontWeight:    400,
              color:         '#f0f4fa',
              lineHeight:    1.15,
              margin:        '0 0 20px',
              letterSpacing: '-0.01em',
            }}>
              {translation.title}
            </h1>

            {/* Excerpt */}
            {translation.excerpt && (
              <p style={{
                fontFamily: 'var(--font-sans)', fontSize: 'clamp(16px, 2vw, 19px)',
                color: 'rgba(240,244,250,0.65)', lineHeight: 1.7, margin: '0 0 28px',
              }}>
                {translation.excerpt}
              </p>
            )}

            {/* Meta row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap',
              fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(240,244,250,0.4)',
              paddingBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '36px',
            }}>
              {article.authors && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {article.authors.avatar && (
                    <img src={article.authors.avatar} alt={article.authors.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                  )}
                  <span style={{ color: 'rgba(240,244,250,0.7)' }}>{article.authors.name}</span>
                </div>
              )}
              {article.published_at && <span>{formatDate(article.published_at)}</span>}
              <span>{readingTime} मिनट पढ़ें</span>
              <span>{article.views} views</span>
            </div>

            {/* Hero image */}
            {article.featured_image && (
              <div style={{
                width: '100%', aspectRatio: '16 / 9', borderRadius: '12px',
                overflow: 'hidden', marginBottom: '44px',
                background: 'var(--surface)',
              }}>
                <img
                  src={article.featured_image}
                  alt={translation.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            )}

            {/* Article body */}
            <div
              style={{
                fontFamily: 'var(--font-sans)', fontSize: 'clamp(16px, 1.8vw, 18px)',
                lineHeight: 1.9, color: 'rgba(240,244,250,0.72)', letterSpacing: '0.01em',
              }}
              dangerouslySetInnerHTML={{ __html: translation.content || '' }}
            />

            {/* Tags */}
            {tags.length > 0 && (
              <div style={{ marginTop: '56px', paddingTop: '28px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,244,250,0.3)', marginRight: '4px' }}>
                  Tags
                </span>
                {tags.map((tag: string) => (
                  <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(240,244,250,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '3px 10px' }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </>
        )}

        {/* Back link */}
        <div style={{ marginTop: '48px', paddingTop: '28px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <a href="/news" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3b9eff', textDecoration: 'none' }}>
            ← समाचार पर वापस जाएं
          </a>
        </div>

      </article>

      {/* Related articles */}
      {(await getRelatedArticles(article.id, 3)).length > 0 && (
        <RelatedSection articleId={article.id} slug={params.slug} />
      )}

    </div>
  )
}

// ── Related section (async server component) ──────────────────

async function RelatedSection({ articleId, slug }: { articleId: string; slug: string }) {
  const related = await getRelatedArticles(articleId, 3)
  if (!related.length) return null

  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: 'clamp(40px,6vw,64px) clamp(20px,5vw,48px)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#3b9eff', display: 'block', marginBottom: '28px' }}>
          संबंधित लेख — Related Stories
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: '16px' }}>
          {related.map(r => (
            <a key={r.id} href={`/news/hi/${r.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#10151c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', height: '100%', cursor: 'pointer' }}>
                {r.categories[0] && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: CAT_COLORS[r.categories[0]] || '#3b9eff', display: 'block', marginBottom: '10px' }}>
                    {r.categories[0]}
                  </span>
                )}
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 400, color: '#f0f4fa', lineHeight: 1.3, margin: '0 0 14px' }}>
                  {r.title}
                </h3>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(240,244,250,0.35)', letterSpacing: '0.1em' }}>
                  {r.readingTime} मिनट पढ़ें
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
