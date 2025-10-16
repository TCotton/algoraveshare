import React from 'react'
import '@blocknote/core/fonts/inter.css'
import { BlockNoteSchema, createCodeBlockSpec } from '@blocknote/core'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/ariakit'
import type { FormStore } from '@ariakit/react'
import '@blocknote/ariakit/style.css'

export default function Editor(props: { form: FormStore }) {
  // Only render if window/document is defined (browser)
  if (typeof window === 'undefined' || typeof document === 'undefined')
    return null

  const { form } = props
  if (process.env.NODE_ENV === 'development')
    console.log(form)

  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    schema: BlockNoteSchema.create().extend({
      blockSpecs: {
        codeBlock: createCodeBlockSpec({
          indentLineWithTab: true,
          defaultLanguage: 'haskell',
          supportedLanguages: {
            typescript: {
              name: 'TypeScript',
              aliases: ['ts'],
            },
            javascript: {
              name: 'JavaScript',
              aliases: ['js'],
            },
            haskell: {
              name: 'Haskell',
              aliases: ['hs'],
            },
          },
          // createHighlighter removed, not available in @blocknote/core
        }),
      },
    }),
    initialContent: [
      {
        type: 'codeBlock',
        props: {
          language: 'javascript',
        },
        content: [
          {
            type: 'text',
            text: 'const x = 3 * 4;',
            styles: {},
          },
        ],
      },
      {
        type: 'paragraph',
      },
      {
        type: 'heading',
        props: {
          textColor: 'default',
          backgroundColor: 'default',
          textAlignment: 'left',
          level: 3,
        },
        content: [
          {
            type: 'text',
            text: 'Click on "JavaScript" above to see the different supported languages',
            styles: {},
          },
        ],
      },
      {
        type: 'paragraph',
      },
    ],
  })
  // Renders the editor instance using a React component.
  return (
    <BlockNoteView
      editor={editor}
      className="form-textarea"
      autoCapitalize="none"
      autoCorrect="off"
    />
  )
}
