'use client'

import { useState } from 'react'
import type { ArticleCard, ArticleCategory } from '@/types/article'
import { timeAgo } from '@/lib/utils'

const CATEGORIES: ArticleCategory[] = [
  'NASA', 'SpaceX', 'ISRO', 'ESA', 'JAXA',
  'Astronomy', 'Discoveries', 'Technology', 'Missions', 'Science',
]

const CAT_COLORS: Record<string, string> = {
  NASA: '#3b9eff', SpaceX: '#9f7aea', ISRO: '#f97316',
  ESA: '#34d897', JAXA: '#c9a96e', Astronomy: '#3b9eff',
  Discoveries: '#34d897', Technology: '#9f7aea',
  Missions: '#c9a96e', Science: '#f0f4fa',
}

interface Props {
  articles: ArticleCard[]
  featured: ArticleCard[]
  total:    number
}

export function NewsPage({ articles, featured, total }: Props) {
  const [activeCategory, setActiveCategory] = useState<ArticleCategory | null>(null)

  const lead      = featured[0] || articles[0] || null
  const secondary = featured.slice(1, 3)
  const rest      = articles.filter(a => a.id !== lead?.id)

  const filtered = activeCategory
    ? articles.filter(a => a.categories.includes(activeCategory))
    : rest

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: 'var(--nav-height)' }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '48px 0 32px' }}>
        <div className="page-container">
          <span className="eyebrow">Space Intelligence</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300, color: '#fff', margin: '0 0 16px' }}>
            Latest News
          </h1>
          <p style={{ color: 'var(--dim)', fontSize: '16px', maxWidth: '560px', margin: 0 }}>
            Scientific journalism, mission updates, and discoveries from across the space industry.
          </p>

          {/* Category filter */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '28px' }}>
            <FilterBtn active={activeCategory === null} onClick={() => setActiveCategory(null)} color="var(--accent)">
              All
            </FilterBtn>
            {CATEGORIES.map(cat => (
              <FilterBtn
                key={cat}
                active={activeCategory === cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                color={CAT_COLORS[cat]}
              >
                {cat}
              </FilterBtn>
            ))}
          </div>
        </div>
      </div>

      <div className="page-container" style={{ padding: '48px' }}>

        {/* Empty state */}
        {articles.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📡</div>
            <p className="eyebrow">No articles published yet</p>
            <p style={{ color: 'var(--faint)', marginTop: '8px', fontSize: '14px' }}>
              Articles published from the admin panel will appear here.
            </p>
          </div>
        )}

        {/* Lead article */}
        {lead && !activeCategory && (
          <div style={{ marginBottom: '48px' }}>
            <a href={`/news/${lead.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
              <div
                style={{ display: 'grid', gridTemplateColumns: lead.featuredImage ? '1fr 420px' : '1fr', gap: '0', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-hi)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <div style={{ padding: '36px' }}>
                  {lead.articleType === 'breaking-news' && (
                    <span style={{ display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#07090c', background: 'var(--red)', padding: '3px 8px', borderRadius: '3px', marginBottom: '14px' }}>
                      Breaking
                    </span>
                  )}
                  {lead.categories[0] && <span className="eyebrow">{lead.categories[0]}</span>}
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(22px,3vw,34px)', fontWeight: 400, color: '#fff', lineHeight: 1.2, margin: '0 0 16px' }}>
                    {lead.title}
                  </h2>
                  <p style={{ color: 'var(--dim)', fontSize: '15px', lineHeight: 1.7, margin: '0 0 24px' }}>
                    {lead.excerpt}
                  </p>
                  <div style={{ display: 'flex', gap: '16px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--faint)' }}>
                    {lead.author && <span>{lead.author.name}</span>}
                    {lead.publishedAt && <span>{timeAgo(lead.publishedAt)}</span>}
                    <span>{lead.readingTime} min read</span>
                  </div>
                </div>
                {lead.featuredImage && (
                  <div style={{ backgroundImage: `url(${lead.featuredImage})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '300px' }} />
                )}
              </div>
            </a>
          </div>
        )}

        {/* Secondary row */}
        {secondary.length > 0 && !activeCategory && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '16px', marginBottom: '48px' }}>
            {secondary.map(a => <SmallCard key={a.id} article={a} />)}
          </div>
        )}

        {/* All stories label */}
        {!activeCategory && filtered.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <span className="eyebrow">All Stories</span>
          </div>
        )}

        {/* Main grid */}
        {filtered.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '16px' }}>
            {filtered.map(a => <SmallCard key={a.id} article={a} />)}
          </div>
        )}

        {total > 12 && (
          <p style={{ textAlign: 'center', marginTop: '48px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--faint)', letterSpacing: '0.1em' }}>
            Showing 12 of {total} articles
          </p>
        )}
      </div>
    </div>
  )
}

// ── Filter button ─────────────────────────────────────────────
function FilterBtn({ active, onClick, color, children }: { active: boolean; onClick: () => void; color: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '4px', border: '1px solid', cursor: 'pointer', background: active ? color : 'transparent', borderColor: active ? color : 'var(--border)', color: active ? '#07090c' : 'var(--dim)', transition: 'all 0.15s' }}>
      {children}
    </button>
  )
}

// ── Small card ────────────────────────────────────────────────
function SmallCard({ article }: { article: ArticleCard }) {
  const CAT_COLORS: Record<string, string> = {
    NASA: '#3b9eff', SpaceX: '#9f7aea', ISRO: '#f97316',
    ESA: '#34d897', JAXA: '#c9a96e', Astronomy: '#3b9eff',
    Discoveries: '#34d897', Technology: '#9f7aea',
    Missions: '#c9a96e', Science: '#f0f4fa',
  }
  return (
    <a href={`/news/${article.slug}`} style={{ textDecoration: 'none' }}>
      <div
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'border-color 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-hi)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
      >
        {article.featuredImage && (
          <div style={{ backgroundImage: `url(${article.featuredImage})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '140px', flexShrink: 0 }} />
        )}
        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {article.articleType === 'breaking-news' && (
            <span style={{ display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#07090c', background: 'var(--red)', padding: '2px 7px', borderRadius: '3px', marginBottom: '10px', width: 'fit-content' }}>Breaking</span>
          )}
          {article.categories[0] && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: CAT_COLORS[article.categories[0]] || 'var(--accent)', display: 'block', marginBottom: '8px' }}>
              {article.categories[0]}
            </span>
          )}
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', fontWeight: 400, color: '#fff', lineHeight: 1.3, margin: '0 0 10px', flex: 1 }}>
            {article.title}
          </h3>
          <div style={{ display: 'flex', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--faint)', marginTop: 'auto' }}>
            {article.publishedAt && <span>{timeAgo(article.publishedAt)}</span>}
            <span>{article.readingTime} min</span>
          </div>
        </div>
      </div>
    </a>
  )
                    }
