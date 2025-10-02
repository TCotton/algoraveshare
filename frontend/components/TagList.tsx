import React from 'react'
export default function TagList({ tags }: { tags: { tagId: number; name: string }[] }) {
  return (
    <div className="tags">
      {tags.map((t) => (
        <span key={t.tagId} className="tag">{t.name}</span>
      ))}
    </div>
  )
}
