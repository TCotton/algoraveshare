import React from 'react'
import '@blocknote/core/fonts/inter.css'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/ariakit'
import '@blocknote/ariakit/style.css'

export default function Editor() {
  // Only render if window/document is defined (browser)
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null
  }
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: 'paragraph',
        content: '🪶 Welcome to BlockNote + Ariakit!',
      },
    ],
  })
  // Renders the editor instance using a React component.
  return (
    <BlockNoteView
      editor={editor}
      formattingToolbar={false}
    />
  )
}
