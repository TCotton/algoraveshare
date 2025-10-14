import React from 'react'
import * as Ariakit from '@ariakit/react'
import SelectForm from '../forms/SelectForm'
import { html } from './description-text.ts'
import Editor from './Editor.tsx'

export default function NewForm() {
  const form = Ariakit.useFormStore({ defaultValues: { projectName: '', description: '', singleProject: '', formTextarea: '' } })

  form.useSubmit((state) => {
    const { values } = state
    // clear previous errors
    form.setError('projectName', '')
    form.setError('description', '')
    form.setError('singleProject', '')

    let hasError = false
    if (!String(values.projectName || '').trim()) {
      form.setError('projectName', 'Name is required')
      hasError = true
    }

    if (values.projectName.trim().length > 200) {
      form.setError('projectName', 'The project name must not be longer than 200 characters')
      hasError = true
    }

    if (!String(values.description || '').trim()) {
      form.setError('description', 'Description is required')
      hasError = true
    }

    if (!values.singleProject) {
      form.setError('singleProject', 'Don\'t forget to add your code!')
      hasError = true
    }

    if (hasError) {
      return
    }
    alert(JSON.stringify(values))
  })

  return (
    <Ariakit.Form
      store={form}
      aria-labelledby="add-new-participant"
      className="form-wrapper"
    >
      <div className="field">
        <Ariakit.FormLabel name={form.names.projectName}>Name</Ariakit.FormLabel>
        <Ariakit.FormInput
          name={form.names.projectName}
          placeholder="Name of project"
          className="input"
          autoCapitalize="none"
          autoComplete="off"
          size-="large"
        />
        <Ariakit.FormError name={form.names.projectName} className="error" />
      </div>
        <div className="field">
            <Editor />
        </div>
      <div className="field">
        <Ariakit.FormLabel name={form.names.description}>
          Description
        </Ariakit.FormLabel>
        <div className="description-text">
          <p>When writing your description, consider addressing some of the following questions:</p>
          <div
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
        <textarea
          name={String(form.names.formTextarea)}
          value={form.useValue(form.names.formTextarea)}
          onChange={event => form.setValue(form.names.formTextarea, event.target.value)}
          placeholder="Describe the project..."
          className="form-textarea"
          autoCapitalize="none"
          autoCorrect="off"
          rows={4}
        />
        <Ariakit.FormError name={form.names.description} className="error" />
      </div>
      <div className="field">
        <SelectForm
          label="Choose a project type"
          items={[
            { value: 'finished', label: 'Finished Project' },
            { value: 'before-after', label: 'Before and After Live Coding Project' },
          ]}
        />
      </div>
      <div className="form-textarea-single">
        <Ariakit.FormLabel name={form.names.singleProject}>
          Description
        </Ariakit.FormLabel>
        <textarea
          name={String(form.names.singleProject)}
          value={form.useValue('singleProject')}
          onChange={e => form.setValue('singleProject', e.target.value)}
          placeholder="Add code here..."
          className="form-textarea-single"
          autoCapitalize="none"
          autoCorrect="off"
          rows={4}
        />
        <Ariakit.FormError name={form.names.singleProject} className="error" />
      </div>
      <div className="buttons">
        <Ariakit.FormSubmit className="button">Submit</Ariakit.FormSubmit>
      </div>
    </Ariakit.Form>
  )
}
;
