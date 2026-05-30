const RAW = 'https://raw.githubusercontent.com/hikari-2424/awesome-reasonix/main'

export interface Skill {
  id: string; name: string; type: string; category: string
  description: string; description_en?: string; description_ru?: string
  url: string; rawUrl?: string; tags: string[]; tags_en?: string[]; tags_ru?: string[]
  installCmd?: string
}
export interface Registry { entries: Skill[] }
export interface Ratings { skills: Record<string, { average: number; count: number }> }
export interface Review { rating: number; content: string; author: string; createdAt: string }

export async function fetchRegistry(): Promise<Registry> {
  const res = await fetch(`${RAW}/registry.json`, { next: { revalidate: 300 } })
  return res.json()
}

export async function fetchRatings(): Promise<Ratings> {
  const res = await fetch(`${RAW}/ratings.json`, { next: { revalidate: 120 } })
  return res.ok ? res.json() : { skills: {} }
}

export async function fetchSkillContent(id: string): Promise<string> {
  const res = await fetch(`${RAW}/skills/${id}.md`, { next: { revalidate: 600 } })
  if (!res.ok) return `# ${id}\n\nContent not found. [View on GitHub](${RAW}/skills/${id}.md)`
  return res.text()
}

export async function fetchReviews(skillId: string): Promise<Review[]> {
  try {
    const res = await fetch(`https://api.github.com/repos/hikari-2424/awesome-reasonix/contents/reviews/${skillId}`, {
      headers: { Accept: 'application/vnd.github.v3+json' }, next: { revalidate: 120 }
    })
    if (!res.ok) return []
    const files: { name: string; download_url: string }[] = await res.json()
    return Promise.all(files.filter(f => f.name.endsWith('.json')).map(async f => {
      try { const r = await fetch(f.download_url); return r.json() } catch { return null }
    }))
  } catch { return [] }
}
