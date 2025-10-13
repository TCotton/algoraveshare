import React from 'react'
import * as Ariakit from '@ariakit/react'

export default function SelectForm() {
  return (
    <div className="form-textarea">
      <Ariakit.FormLabel name={form.names.description}>
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
      <Ariakit.FormError name={form.names.description} className="error" />
    </div>
  )
}
