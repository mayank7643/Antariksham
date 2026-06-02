// Supported languages
export type SupportedLang = 'en' | 'hi'

export const SUPPORTED_LANGS: { code: SupportedLang; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi',   nativeLabel: 'हिन्दी'  },
]

// ── Database row (matches article_translations table exactly) ──

export interface ArticleTranslationRow {
  id:         string
  article_id: string
  lang:       SupportedLang
  title:      string
  excerpt:    string | null
  content:    string | null
  seo_id:     string | null
  created_at: string
  updated_at: string
}

// ── Camel-case app interface ───────────────────────────────────

export interface ArticleTranslation {
  id:        string
  articleId: string
  lang:      SupportedLang
  title:     string
  excerpt:   string | null
  content:   string | null
  seoId:     string | null
  createdAt: string
  updatedAt: string
}

// ── Form shape used in ArticleForm translation tabs ───────────

export interface TranslationFormState {
  title:   string
  excerpt: string
  content: string
}

export const EMPTY_TRANSLATION: TranslationFormState = {
  title:   '',
  excerpt: '',
  content: '',
}

// ── API request/response shapes ───────────────────────────────

// POST /api/admin/translations  — create
export interface CreateTranslationPayload {
  articleId: string
  lang:      SupportedLang
  title:     string
  excerpt?:  string
  content?:  string
  seoId?:    string
}

// PATCH /api/admin/translations?id=xxx  — update
export interface UpdateTranslationPayload {
  title?:   string
  excerpt?: string
  content?: string
  seoId?:   string
}

// GET response
export interface TranslationsResponse {
  translations: ArticleTranslation[]
}

// ── Helper: map DB row → app interface ────────────────────────

export function mapTranslationRow(row: ArticleTranslationRow): ArticleTranslation {
  return {
    id:        row.id,
    articleId: row.article_id,
    lang:      row.lang,
    title:     row.title,
    excerpt:   row.excerpt,
    content:   row.content,
    seoId:     row.seo_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
