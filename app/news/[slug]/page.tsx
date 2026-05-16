import { getArticleBySlug, getAllArticleSlugs, getRelatedArticles } from '@/modules/news/services/getArticles'
import { notFound } from 'next/navigation'
import { formatDate, timeAgo } from '@/lib/utils'
import type { Metadata } from 'next'

export const revalidate = 300

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug)
  if (!article) return { title: 'Article Not Found' }
  return {
    title:       article.title,
    description: article.excerpt,
    openGraph: {
      title:         article.title,
      description:   article.excerpt,
      images:        article.featuredImage ? [article.featuredImage] : [],
      type:          'article',
      publishedTime: article.publishedAt || undefined,
    },
  }
}

const CAT_COLORS: Record<string, string> = {
  NASA: '#3b9eff', SpaceX: '#9f7aea', ISRO: '#f97316',
  ESA: '#34d897', JAXA: '#c9a96e', Astronomy: '#3b9eff',
  Discoveries: '#34d897', Technology: '#9f7aea',
  Missions: '#c9a96e', Science: '#f0f4fa',
}

export default async function ArticlePage(
  { params }: { params: { slug: string } }
) {
  const article = await getArticleBySlug(params.slug)
  if (!article) notFound()

  const related = await getRelatedArticles(article.id, 3)

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: 'var(--nav-height)' }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '48px 0 40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 48px' }}>

          {article.articleType === 'breaking-news' && (
            <span style={{ display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#07090c', background: '#f05a5a', padding: '3px 8px', borderRadius: '3px', marginBottom: '16px' }}>
              Breaking
            </span>
          )}

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {article.categories.map(cat => (
              <a key={cat} href={`/news`} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: CAT_COLORS[cat] || '#3b9eff', textDecoration: 'none' }}>
                {cat}
              </a>
            ))}
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 400, color: '#fff', lineHeight: 1.15, margin: '0 0 20px' }}>
            {article.title}
          </h1>

          {article.excerpt && (
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '18px', color: 'var(--dim)', lineHeight: 1.6, margin: '0 0 28px' }}>
              {article.excerpt}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--faint)' }}>
            {article.author && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {article.author.avatar && (
                  <img src={article.author.avatar} alt={article.author.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                )}
                <span style={{ color: 'var(--dim)' }}>{article.author.name}</span>
              </div>
            )}
            {article.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
            <span>{article.readingTime} min read</span>
            <span>{article.views} views</span>
          </div>
        </div>
      </div>

      {/* Featured image */}
      {article.featuredImage && (
        <div style={{ backgroundImage: `url(${article.featuredImage})`, backgroundSize: 'cover', backgroundPosition: 'center', height: 'clamp(240px,40vh,480px)', width: '100%' }} />
      )}

      {/* Article body */}
      <div style={{ padding: '48px 0 80px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 48px' }}>
          <div
            style={{ fontFamily: 'var(--font-sans)', fontSize: '17px', lineHeight: 1.8, color: 'var(--dim)' }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--faint)', marginRight: '12px' }}>
                Tags
              </span>
              {article.tags.map(tag => (
                <span key={tag} style={{ display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--dim)', border: '1px solid var(--border)', borderRadius: '4px', padding: '3px 10px', marginRight: '6px', marginBottom: '6px' }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Back link */}
          <div style={{ marginTop: '48px' }}>
            <a href="/news" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', textDecoration: 'none' }}>
              ← Back to News
            </a>
          </div>
        </div>
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '48px 0' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 48px' }}>
            <span className="eyebrow" style={{ display: 'block', marginBottom: '24px' }}>Related Stories</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '16px' }}>
              {related.map(r => (
                <a key={r.id} href={`/news/${r.slug}`} style={{ textDecoration: 'none' }}>
                  <div
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', cursor: 'pointer', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-hi)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  >
                    {r.categories[0] && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: CAT_COLORS[r.categories[0]] || 'var(--accent)', display: 'block', marginBottom: '8px' }}>
                        {r.categories[0]}
                      </span>
                    )}
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', fontWeight: 400, color: '#fff', lineHeight: 1.3, margin: '0 0 12px' }}>
                      {r.title}
                    </h3>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--faint)' }}>
                      {r.readingTime} min read
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
            }
