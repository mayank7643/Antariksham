import Link                from 'next/link'
import { getAdminStats }  from '@/modules/admin/services/getAdminStats'
import { formatDate }     from '@/lib/utils'
import {
  FileText,
  Rocket,
  Eye,
  Star,
  PenSquare,
  Plus,
  CheckCircle,
  Clock,
} from 'lucide-react'

export const revalidate = 60

export default async function AdminDashboard() {
  const stats = await getAdminStats()

  return (
    <div>

      {/* Page header */}
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 400, color: 'var(--white)', margin: '0 0 6px' }}>
          Mission Control
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(240,244,250,0.35)', letterSpacing: '0.08em' }}>
          Antariksham.org — Content & Platform Dashboard
        </p>
      </div>

      {/* ── Stat cards ─────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginBottom: '36px' }}>

        <StatCard
          icon={<FileText size={16} />}
          label="Total Articles"
          value={stats.totalArticles}
          color="#3b9eff"
        />
        <StatCard
          icon={<CheckCircle size={16} />}
          label="Published"
          value={stats.publishedArticles}
          color="#34d897"
        />
        <StatCard
          icon={<Clock size={16} />}
          label="Drafts"
          value={stats.draftArticles}
          color="#c9a96e"
        />
        <StatCard
          icon={<Star size={16} />}
          label="Featured"
          value={stats.featuredArticles}
          color="#e879f9"
        />
        <StatCard
          icon={<Rocket size={16} />}
          label="Total Missions"
          value={stats.totalMissions}
          color="#3b9eff"
        />
        <StatCard
          icon={<Rocket size={16} />}
          label="Active Missions"
          value={stats.activeMissions}
          color="#34d897"
        />

      </div>

      {/* ── Quick actions ───────────────────────── */}
      <div style={{ marginBottom: '36px' }}>
        <SectionLabel>Quick Actions</SectionLabel>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <ActionButton href="/admin/articles/new" icon={<Plus size={13} />} primary>
            New Article
          </ActionButton>
          <ActionButton href="/admin/articles" icon={<FileText size={13} />}>
            Manage Articles
          </ActionButton>
          <ActionButton href="/admin/missions" icon={<Rocket size={13} />}>
            Manage Missions
          </ActionButton>
          <ActionButton href="/admin/homepage" icon={<PenSquare size={13} />}>
            Homepage Builder
          </ActionButton>
        </div>
      </div>

      {/* ── Recent articles ─────────────────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <SectionLabel>Recent Articles</SectionLabel>
          <Link href="/admin/articles" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#3b9eff', textDecoration: 'none' }}>
            View all →
          </Link>
        </div>

        {stats.recentArticles.length === 0 ? (
          <div style={{ background: '#0b0f18', border: '1px solid var(--border)', borderRadius: '10px', padding: '40px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(240,244,250,0.25)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              No articles yet
            </p>
            <Link href="/admin/articles/new" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#3b9eff', textDecoration: 'none', display: 'inline-block', marginTop: '12px' }}>
              Create your first article →
            </Link>
          </div>
        ) : (
          <div style={{ background: '#0b0f18', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
            {stats.recentArticles.map((article, i) => (
              <div
                key={article.id}
                style={{
                  display:      'flex',
                  alignItems:   'center',
                  gap:          '16px',
                  padding:      '14px 20px',
                  borderBottom: i < stats.recentArticles.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                {/* Status dot */}
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0, background: article.status === 'published' ? '#34d897' : '#c9a96e', boxShadow: article.status === 'published' ? '0 0 6px #34d897' : 'none' }} />

                {/* Title */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--white)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {article.title}
                  </p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(240,244,250,0.35)', margin: '3px 0 0', letterSpacing: '0.05em' }}>
                    {article.status === 'published' && article.publishedAt
                      ? `Published ${formatDate(article.publishedAt)}`
                      : 'Draft'}
                  </p>
                </div>

                {/* Views */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(240,244,250,0.35)', flexShrink: 0 }}>
                  <Eye size={12} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{article.views.toLocaleString()}</span>
                </div>

                {/* Edit link */}
                <Link
                  href={`/admin/articles/${article.id}`}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#3b9eff', textDecoration: 'none', flexShrink: 0 }}
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────

function StatCard({ icon, label, value, color }: {
  icon:  React.ReactNode
  label: string
  value: number
  color: string
}) {
  return (
    <div style={{ background: '#0b0f18', border: '1px solid var(--border)', borderRadius: '10px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'rgba(240,244,250,0.4)' }}>
        {icon}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{label}</span>
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '32px', color, fontWeight: 300, lineHeight: 1 }}>
        {value}
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(240,244,250,0.35)', margin: '0 0 14px' }}>
      {children}
    </p>
  )
}

function ActionButton({ href, icon, children, primary }: {
  href:     string
  icon:     React.ReactNode
  children: React.ReactNode
  primary?: boolean
}) {
  return (
    <Link
      href={href}
      style={{
        display:      'inline-flex',
        alignItems:   'center',
        gap:          '7px',
        padding:      '10px 18px',
        borderRadius: '6px',
        fontFamily:   'var(--font-mono)',
        fontSize:     '11px',
        letterSpacing:'0.1em',
        textTransform:'uppercase',
        textDecoration:'none',
        background:   primary ? '#3b9eff' : '#0b0f18',
        color:        primary ? '#07090c' : 'rgba(240,244,250,0.7)',
        border:       primary ? 'none' : '1px solid var(--border)',
        fontWeight:   primary ? 700 : 400,
      }}
    >
      {icon}
      {children}
    </Link>
  )
}
