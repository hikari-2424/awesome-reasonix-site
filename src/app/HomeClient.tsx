'use client'

import { useState, useMemo } from 'react'
import SkillCard from '@/components/SkillCard'
import type { Skill, Ratings } from '@/lib/data'

/** 构建每个 skill 的可搜索文本索引（三语全字段） */
function buildSearchIndex(s: Skill): string {
  const parts = [
    s.id,
    s.name,
    s.category,
    s.description,
    s.description_en ?? '',
    s.description_ru ?? '',
    ...(s.tags ?? []),
    ...(s.tags_en ?? []),
    ...(s.tags_ru ?? []),
  ]
  return parts.join(' ').toLowerCase()
}

export default function HomeClient({ skills, ratings }: { skills: Skill[]; ratings: Ratings }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  // 预计算搜索索引（skills 不变时只算一次）
  const indexMap = useMemo(() => {
    const map = new Map<Skill, string>()
    for (const s of skills) map.set(s, buildSearchIndex(s))
    return map
  }, [skills])

  const filtered = useMemo(() => {
    let list = skills
    if (filter === 'skills') list = list.filter(s => s.type === 'skill')
    if (filter === 'mcp') list = list.filter(s => s.type === 'mcp')
    if (search.trim()) {
      // 支持多关键词（空格分隔），全部命中才显示
      const keywords = search.trim().toLowerCase().split(/\s+/)
      list = list.filter(s => {
        const idx = indexMap.get(s) ?? ''
        return keywords.every(kw => idx.includes(kw))
      })
    }
    return list
  }, [skills, search, filter, indexMap])

  return (
    <div>
      <section className="border-b border-gray-100 bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-3">Skills for Reasonix</h1>
          <p className="text-gray-500 mb-6">Drop a markdown file into <code className="bg-gray-100 px-1 rounded text-sm">.reasonix/skills/</code>. Done.</p>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${skills.length} skills — zh / en / ru`}
            className="w-full max-w-md rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
          {search.trim() && (
            <p className="text-xs text-gray-400 mt-2">
              {filtered.length} of {skills.filter(s => filter === 'all' || s.type === filter).length} results for "<span className="text-gray-600">{search.trim()}</span>"
            </p>
          )}
          <div className="flex justify-center gap-2 mt-4">
            {[{ id: 'all', label: 'All' }, { id: 'skills', label: 'Skills' }, { id: 'mcp', label: 'MCP' }].map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`px-3 py-1 rounded text-xs font-medium transition ${filter === f.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >{f.label}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No results.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(s => <SkillCard key={s.id} skill={s} ratings={ratings} />)}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-2xl px-4 pb-16 text-center">
        <div className="rounded-xl bg-gray-50 px-6 py-8">
          <h2 className="font-semibold text-gray-900 mb-1">Share a Skill</h2>
          <p className="text-sm text-gray-500 mb-4">Open an issue on GitHub. Automated checks handle the rest.</p>
          <a href="https://github.com/hikari-2424/awesome-reasonix/issues/new?template=skill-submit.yml" target="_blank" rel="noopener"
            className="inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Submit via Issue →</a>
        </div>
      </section>
    </div>
  )
}
