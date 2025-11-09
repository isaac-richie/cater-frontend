export const CATEGORY_SLUGS: Record<string, string> = {
  All: 'all',
  // Map UX labels to keyword-based categories (backend uses keyword filtering)
  Politics: 'politics',
  Crypto: 'crypto',
  Science: 'science',
  Tech: 'tech',
  Sports: 'sports',
  Culture: 'culture',
  Economics: 'economics',
}

export function normalizeCategory(category?: string): string {
  if (!category) return 'all'
  if (CATEGORY_SLUGS[category]) return CATEGORY_SLUGS[category]
  return category.trim()
}

export function displayCategoryFromSlug(slug: string): string {
  const entry = Object.entries(CATEGORY_SLUGS).find(([, v]) => v === slug)
  return entry ? entry[0] : slug.charAt(0).toUpperCase() + slug.slice(1)
}

export * from './politics'
export * from './crypto'
export * from './science'
export * from './tech'
export * from './sports'
export * from './culture'
export * from './economics'


