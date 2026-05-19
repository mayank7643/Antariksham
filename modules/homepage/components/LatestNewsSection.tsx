import Link from 'next/link'
import { getLatestArticles } from '@/modules/news/services/getArticles'
import { timeAgo } from '@/lib/utils'
import type { ArticleCard } from '@/types/article'

const CATEGORY_COLORS: Record<string, string> = {
  'NASA':        '#3b9eff',
  'SpaceX':      '#9f7aea',
  'ISRO':        '#c9a96e',
  'ESA':         '#e879f9',
  'JAXA':        '#34d897',
  'Astronomy':   '#34d897',
  'Discoveries': '#34d897',
  'Technology':  '#fb923c',
  'Missions':    '#3b9eff',
  'Science':     '#34d897',
}

function getCategoryColor(categories: string[] | undefined): string {
  if (!categories?.length) return '#3b9eff'
  return CATEGORY_COLORS[categories[0]] || '#3b9eff'
}

function ArticleTag({ type }: { type: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    'breaking-news': { label: 'Breaking',  color: '#f05a5a', bg: 'rgba(240,90,90,0.15)'      },
    analysis:        { label: 'Analysis',  color: '#3b9eff', bg: 'rgba(59,158,255,0.12)'     },
    editorial:       { label: 'Editorial', color: '#9f7aea', bg: 'rgba(159,122,234,0.12)'    },
    research:        { label: 'Research',  color: '#34d897', bg: 'rgba(52,216,151,0.12)'     },
    explainer:       { label: 'Explainer', color: '#fb923c', bg: 'rgba(249,115,22,0.12)'     },
    guide:           { label: 'Guide',     color: '#c9a96e', bg: 'rgba(201,169,110,0.12)'    },
    'mission-update':{ label: 'Mission',   color: '#c9a96e', bg: 'rgba(201,169,110,0.12)'    },
  }
  const t = map[type] || { label: 'News', color: '#3b9eff', bg: 'rgba(59,158,255,0.12)' }
  return (
    <span style={{ padding: '3px 8px', borderRadius: '3px', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase' as const, background: t.bg, color: t.color }}>
      {t.label}
    </span>
  )
}

// ── Lead article card ─────────────────────────────────────────
function LeadCard({ article }: { article: ArticleCard }) {
  const color = getCategoryColor(article.categories)
  const categoryLabel = article.categories?.[0] || 'Space'
  return (
    <Link href={`/news/${article.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{ background: '#10151c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', cursor: 'pointer', transition: 'border-color 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
      >
        {/* Hero image */}
        {article.featuredImage && (
          <div style={{ width: '100%', height: 'clamp(180px,25vw,280px)', overflow: 'hidden' }}>
            <img src={article.featuredImage} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        )}
        <div style={{ padding: '28px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color, marginBottom: '14px' }}>
            {categoryLabel}
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(20px,3vw,28px)', fontWeight: 400, lineHeight: 1.2, color: '#ffffff', marginBottom: '14px' }}>
            {article.title}
          </h2>
          {article.excerpt && (
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', lineHeight: 1.75, color: 'rgba(240,244,250,0.8)', marginBottom: '20px' }}>
              {article.excerpt}
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(240,244,250,0.5)' }}>
            <span>
              {article.author?.name ? `By ${article.author.name}` : 'Antariksham Editorial'}
              {article.readingTime ? ` · ${article.readingTime} min read` : ''}
            </span>
            <ArticleTag type={article.articleType || 'news'} />
          </div>
        </div>
      </div>
    </Link>
  )
}

// ── Secondary card ────────────────────────────────────────────
function SecondaryCard({ article }: { article: ArticleCard }) {
  const color = getCategoryColor(article.categories)
  const categoryLabel = article.categories?.[0] || 'Space'
  return (
    <Link href={`/news/${article.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div
        style={{ background: '#10151c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', transition: 'border-color 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
      >
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color, marginBottom: '12px' }}>
            {categoryLabel}
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 400, lineHeight: 1.25, color: '#ffffff', marginBottom: '10px' }}>
            {article.title}
          </h3>
          {article.excerpt && (
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.7, color: 'rgba(240,244,250,0.75)', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {article.excerpt}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(240,244,250,0.45)' }}>
          <span>{article.readingTime ? `${article.readingTime} min read` : timeAgo(article.publishedAt || '')}</span>
          <ArticleTag type={article.articleType || 'news'} />
        </div>
      </div>
    </Link>
  )
}

// ── Compact card ──────────────────────────────────────────────
function CompactCard({ article }: { article: ArticleCard }) {
  const color = getCategoryColor(article.categories)
  const categoryLabel = article.categories?.[0] || 'Space'
  return (
    <Link href={`/news/${article.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div
        style={{ background: '#10151c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '22px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', transition: 'border-color 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
      >
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color, marginBottom: '10px' }}>
            {categoryLabel}
          </div>
          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', fontWeight: 400, lineHeight: 1.3, color: '#ffffff' }}>
            {article.title}
          </h4>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(240,244,250,0.45)', marginTop: '14px' }}>
          <span>{article.readingTime ? `${article.readingTime} min` : timeAgo(article.publishedAt || '')}</span>
          <ArticleTag type={article.articleType || 'news'} />
        </div>
      </div>
    </Link>
  )
}

// ── Placeholder cards (shown when no articles yet) ────────────
function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(240,244,250,0.25)' }}>
        No articles published yet
      </p>
    </div>
  )
}

// ── Main export — Server Component ────────────────────────────
export async function LatestNewsSection() {
  const articles = await getLatestArticles(7)

  const lead       = articles[0] || null
  const secondary  = articles.slice(1, 3)
  const compact    = articles.slice(3, 7)

  return (
    <section style={{ padding: '64px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ padding: '0 24px', maxWidth: '1380px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#3b9eff', marginBottom: '8px' }}>Editorial</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 400, color: '#ffffff', lineHeight: 1.1 }}>Space Intelligence & Journalism</div>
          </div>
          <Link href="/news" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,244,250,0.6)', textDecoration: 'none', whiteSpace: 'nowrap', paddingTop: '4px' }}>
            All articles →
          </Link>
        </div>

        {articles.length === 0 && <EmptyState />}

        {/* Lead */}
        {lead && <LeadCard article={lead} />}

        {/* Secondary row */}
        {secondary.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            {secondary.map(a => <SecondaryCard key={a.id} article={a} />)}
          </div>
        )}

        {/* Compact row */}
        {compact.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {compact.map(a => <CompactCard key={a.id} article={a} />)}
          </div>
        )}

      </div>
    </section>
  )
}
