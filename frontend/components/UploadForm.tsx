import React, { useState } from 'react'

export default function UploadForm({ onUpload }: { onUpload: (meta: any) => void }) {
  const [error, setError] = useState<string | null>(null)
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null)
    const f = e.target.files?.[0]
    if (!f) return
    const allowed = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp3']
    if (!allowed.includes(f.type)) {
      setError('Unsupported file type — only MP3/WAV allowed')
      return
    }
    if (f.size > 10 * 1024 * 1024) { // 10MB limit for demo
      setError('File too large (max 10MB)')
      return
    }
    onUpload({ filename: f.name, size: f.size, mime: f.type })
  }

  return (
    <div>
      <label>
        Upload audio (MP3/WAV)
        <input type="file" accept="audio/*" onChange={handleFile} />
      </label>
      {error && <div style={{ color: 'salmon' }}>{error}</div>}
    </div>
  )
}
