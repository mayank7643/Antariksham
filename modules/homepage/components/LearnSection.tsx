import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase'

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner:     'var(--green)',
  intermediate: 'var(--gold)',
  advanced:     'var(--red)',
}

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner:     'Beginner',
  intermediate: 'Intermediate',
  advanced:     'Advanced',
}

async function getLearnPreview() {
  const { data, error } = await supabaseAdmin()
    .from('knowledge_articles')
    .select('id, title, slug, excerpt, difficulty_level, icon')
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) return []
  return data || []
}

export async function LearnSection() {
  const topics = await getLearnPreview()

  return (
    <section style={{ padding: '64px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ padding: '0 24px', maxWidth: '1380px', margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '8px' }}>Knowledge Layer</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 400, color: '#ffffff', lineHeight: 1.1 }}>Learn Space Science</div>
          </div>
          <Link href="/learn" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,244,250,0.6)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Explore all topics →
          </Link>
        </div>

        {topics.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(240,244,250,0.25)' }}>No articles published yet</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {topics.map(topic => {
            const diffColor = DIFFICULTY_COLORS[topic.difficulty_level] || 'var(--accent)'
            const diffLabel = DIFFICULTY_LABELS[topic.difficulty_level] || topic.difficulty_level
            return (
              <Link key={topic.id} href={`/learn/${topic.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div
                  style={{ background: '#10151c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', cursor: 'pointer', transition: 'border-color 0.2s', height: '100%' }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.18)'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)'}
                >
                  <div style={{ fontSize: '28px', marginBottom: '16px' }}>{topic.icon || '🔭'}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: diffColor, marginBottom: '10px' }}>
                    {diffLabel}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 400, lineHeight: 1.3, color: '#ffffff', marginBottom: '10px' }}>
                    {topic.title}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.7, color: 'rgba(240,244,250,0.75)', margin: 0 }}>
                    {topic.excerpt}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

      </div>
    </section>
  )
}
