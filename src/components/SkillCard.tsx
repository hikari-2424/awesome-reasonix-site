'use client'

import { useState } from 'react'
import Link from 'next/link'
import StarRating from './StarRating'
import type { Skill, Ratings } from '@/lib/data'

export default function SkillCard({ skill, ratings }: { skill: Skill; ratings: Ratings }) {
  const [copied, setCopied] = useState(false)
  const r = ratings.skills[skill.id]
  const avg = r?.average ?? 0
  const count = r?.count ?? 0

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300 transition">
      <div className="flex items-start justify-between mb-1">
        <Link href={`/skills/${skill.id}`} className="font-medium text-gray-900 hover:underline">
          {skill.name}
        </Link>
        <span className="text-[10px] text-gray-400 bg-gray-100 rounded px-1.5 py-0.5">
          {skill.type === 'mcp' ? 'MCP' : 'Skill'}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-2 line-clamp-2">{skill.description}</p>

      {skill.tags && skill.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {skill.tags.slice(0, 4).map(t => (
            <span key={t} className="text-[10px] text-gray-400 bg-gray-50 rounded px-1.5 py-0.5">{t}</span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1 mb-2">
        <span className="text-amber-400 text-xs">{'★'.repeat(Math.round(avg))}</span>
        <span className="text-xs text-gray-400">{count > 0 ? `${avg.toFixed(1)} (${count})` : '—'}</span>
      </div>

      {skill.installCmd && (
        <div className="flex items-center gap-1">
          <code className="flex-1 truncate rounded bg-gray-100 px-2 py-1 text-[11px] text-gray-600">
            {skill.installCmd}
          </code>
          <button
            onClick={() => { navigator.clipboard.writeText(skill.installCmd!); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
            className="shrink-0 rounded bg-gray-200 px-2 py-1 text-[10px] text-gray-500 hover:bg-gray-300"
          >
            {copied ? '✓' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  )
}
