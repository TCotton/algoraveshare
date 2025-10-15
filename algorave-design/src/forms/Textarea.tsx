import React from 'react'
import * as Ariakit from '@ariakit/react'

export default function Textarea({ form }: { form: Ariakit.FormStore }) {
  return (
    <div className="form-textarea">
      <Ariakit.FormLabel name="description">
        Description
      </Ariakit.FormLabel>
      <textarea
        name={String(form.names.description)}
        value={form.useValue('description')}
        onChange={e => form.setValue('description', e.target.value)}
        placeholder="Describe the project..."
        className="form-textarea"
        autoCapitalize="none"
        autoCorrect="off"
        rows={4}
      />
      <Ariakit.FormError name="description" className="error" />
    </div>
  )
}
