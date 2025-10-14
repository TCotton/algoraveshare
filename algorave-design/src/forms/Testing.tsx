import React, { useState } from 'react'
import { useCreateBlockNote, createReactBlockSpec } from '@blocknote/react'
import { BlockNoteView } from "@blocknote/ariakit"
import { Menu, MenuButton, MenuItem } from "@ariakit/react";
import '@blocknote/core/style.css'

/**
 * Custom "codeExample" block type
 * Supports a title (e.g. "JavaScript Example") and code content.
 */
const CodeExampleBlock = createReactBlockSpec({
  type: 'codeExample',
  propSchema: {
    title: { default: 'Code Example' },
    code: { default: 'console.log(\'Hello world!\');' },
  },
  content: 'none',
  render: ({ block }) => (
    <div
      style={{
        background: '#1e1e1e',
        color: '#dcdcdc',
        padding: '1rem',
        borderRadius: '8px',
        fontFamily: 'Menlo, Monaco, Consolas, monospace',
      }}
    >
      <div
        style={{
          fontSize: '0.9rem',
          fontWeight: 600,
          marginBottom: '0.5rem',
          opacity: 0.8,
        }}
      >
        {block.props.title}
      </div>
      <pre
        style={{
          margin: 0,
          whiteSpace: 'pre-wrap',
          overflowX: 'auto',
        }}
      >
        {block.props.code}
      </pre>
    </div>
  ),
})

export default function Editor() {
  const editor = useCreateBlockNote({
    blockSpecs: {
      codeExample: CodeExampleBlock,
    },
    blockTypes: [
      'paragraph',
      'heading',
      'bulletListItem',
      'numberedListItem',
      'codeBlock', // built-in
      'codeExample',
    ],
    initialContent: [
      {
        type: 'paragraph',
        content: '🪶 Welcome to BlockNote + Ariakit!',
      },
    ],
  })

  const [html, setHtml] = useState('')

  const handleExport = async () => {
    const htmlOut = await editor.blocksToHTML()
    setHtml(htmlOut)
  }

  return (
    <div style={{ maxWidth: 720, margin: '2rem auto', padding: '1rem' }}>

      {/* 👇 Updated component name */}
      <BlockNoteView editor={editor} theme="light" />

      {html && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Exported HTML</h3>
          <textarea
            style={{
              width: '100%',
              height: '150px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
            }}
            value={html}
            readOnly
          />
        </div>
      )}
    </div>
  )
}
