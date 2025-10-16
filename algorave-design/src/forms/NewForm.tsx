import React, { useEffect, useState } from 'react'
import * as Ariakit from '@ariakit/react'
import { isEmptyString } from 'ramda-adjunct'
import { equals } from 'ramda'
import SelectForm from '../forms/SelectForm'
import FormTextarea from '../forms/FormTextarea'
import { getDescriptionHtml } from './description-text.ts'

export default function NewForm() {
  // Use useState to track the current project software selection
  const [currentProjectSoftware, setCurrentProjectSoftware] = useState<string | null>(null)
  const [currentProjectType, setCurrentProjectType] = useState<string | null>(null)

  const form = Ariakit.useFormStore({
    defaultValues: {
      projectName: '',
      description: '',
      singleProject: '',
      projectSoftware: '',
      projectType: '',
      codeBlockOne: '',
      codeBlockTwo: '',
    },
  })

  const projectSoftwareDefault = 'Project software'
  const projectTypeDefault = 'Project type'
  const strudel = 'Strudel'
  const tidal = 'Tidal Cycles'
  const finishedProject = 'Finished Project'
  const beforeAfterLiveCodingProject = 'Before and After Live Coding Project'

  form.useSubmit((state) => {
    console.info(state)
    const { values } = state
    console.info(values)

    let hasError = false

    // Validate projectSoftware
    if (isEmptyString(values.projectSoftware) || equals(values.projectSoftware, projectSoftwareDefault)) {
      form.setError('projectSoftware', 'Please select a project software')
      hasError = true
    }
    else { form.setError('projectSoftware', '') }

    // Validate projectType
    if (isEmptyString(values.projectType) || equals(values.projectType, projectTypeDefault)) {
      form.setError('projectType', 'Please select a project type')
      hasError = true
    }
    else { form.setError('projectType', '') }

    // Validate projectName
    const name = String(values.projectName ?? '').trim()
    if (!name) {
      form.setError('projectName', 'Name is required')
      hasError = true
    }
    else if (values.projectName.trim().length > 200) {
      form.setError('projectName', 'The project name must not be longer than 200 characters')
      hasError = true
    }
    else { form.setError('projectName', '') }

    // Validate description
    const desc = String(values.description ?? '').trim()
    if (!desc) {
      form.setError('description', 'Description is required')
      hasError = true
    }
    else { form.setError('description', '') }

    // Validate singleProject
    if (equals(finishedProject, currentProjectType) && isEmptyString(values.singleProject.trim())) {
      form.setError('singleProject', 'Don\'t forget to add your code!')
      hasError = true
    }
    else { form.setError('singleProject', '') }

    // Validate codeBlockOne
    if (equals(beforeAfterLiveCodingProject, currentProjectType) && isEmptyString(values.codeBlockOne.trim())) {
      form.setError('codeBlockOne', 'Don\'t forget to add your code!')
      hasError = true
    }
    else { form.setError('codeBlockOne', '') }

    // Validate codeBlockTwo
    if (equals(beforeAfterLiveCodingProject, currentProjectType) && isEmptyString(values.codeBlockTwo.trim())) {
      form.setError('codeBlockTwo', 'Don\'t forget to add your code!')
      hasError = true
    }
    else { form.setError('codeBlockTwo', '') }

    if (hasError) {
      return
    }

    alert(JSON.stringify(values))
  })

  // Call all hooks at the top level - never inside conditionals
  const descriptionValue = form.useValue('description')
  const singleProjectValue = form.useValue('singleProject')
  const codeBlockOneValue = form.useValue('codeBlockOne')
  const codeBlockTwoValue = form.useValue('codeBlockTwo')

  // Callback function that updates state when projectSoftware selection changes
  const projectSoftwareFn = (_label: string, value: string): void => {
    setCurrentProjectSoftware(value)
  }

  const projectTypeFn = (_label: string, value: string): void => {
    setCurrentProjectType(value)
  }

  // Use useEffect to log or perform side effects when projectSoftware changes
  useEffect(() => {
    if (currentProjectSoftware && !equals(currentProjectType, projectSoftwareDefault)) {
      console.info('Project type changed to:', currentProjectSoftware)
    }
  }, [currentProjectSoftware])

  // Use useEffect to log or perform side effects when projectType changes
  useEffect(() => {
    if (currentProjectType && !equals(currentProjectType, projectTypeDefault)) {
      console.info('Project software changed to:', currentProjectType)
    }
  }, [currentProjectType])

  return (
    <Ariakit.Form
      store={form}
      aria-labelledby="add-new-participant"
      className="form-wrapper"
      method="post"
    >
      <div className="field">
        <SelectForm
          label="Choose the project software"
          name="projectSoftware"
          form={form}
          items={[
            { value: projectSoftwareDefault, label: 'project-software' },
            { value: 'Tidal Cycles', label: 'tidal-cycles' },
            { value: 'Strudel', label: 'strudel' },
          ]}
          selectClass="project-software"
          onChange={projectSoftwareFn}
        />
        <Ariakit.FormError name={form.names.projectSoftware} className="error" />
      </div>
      <div className="field field-project-name">
        <Ariakit.FormLabel name={form.names.projectName}>Name</Ariakit.FormLabel>
        <Ariakit.FormInput
          name={form.names.projectName}
          placeholder="Name of project"
          className="input"
          autoCapitalize="none"
          autoComplete="off"
          size-="large"
          required
        />
        <Ariakit.FormError name={form.names.projectName} className="error" />
      </div>
      <div className="field">
        <SelectForm
          label="Choose a project type"
          name="projectType"
          form={form}
          items={[
            { value: projectTypeDefault, label: 'project-type' },
            { value: 'Finished Project', label: 'finished' },
            { value: 'Before and After Live Coding Project', label: 'before-after' },
          ]}
          selectClass="project-type"
          onChange={projectTypeFn}
        />
        <Ariakit.FormError name={form.names.projectType} className="error" />
      </div>
      {(currentProjectSoftware === strudel || currentProjectSoftware === tidal) && (
        <div className="field description-textarea">
          <Ariakit.FormLabel name={form.names.description}>
            Description
          </Ariakit.FormLabel>
          <div className="description-text">
            <p>When writing your description, consider addressing some of the following questions:</p>
            <div
              dangerouslySetInnerHTML={{ __html: getDescriptionHtml(currentProjectSoftware) }}
            />
          </div>
          <FormTextarea
            name="description"
            value={descriptionValue}
            onChange={event => form.setValue('description', event.target.value)}
            placeholder="Describe the project..."
            className="form-textarea"
            autoCapitalize="none"
            autoCorrect="off"
            rows={4}
            required
          />
          <Ariakit.FormError name={form.names.description} className="error" />
        </div>
      )}
      {/* Removed duplicate SelectForm for project type. If needed, add name and form props. */}
      {currentProjectType === finishedProject && (
        <div className="field form-textarea-single">
          <Ariakit.FormLabel name={form.names.singleProject}>
            Code block
          </Ariakit.FormLabel>
          <FormTextarea
            name={String(form.names.singleProject)}
            value={singleProjectValue}
            onChange={e => form.setValue('singleProject', e.target.value)}
            placeholder="Add code here..."
            className="form-single-codeblock"
            autoCapitalize="none"
            autoCorrect="off"
            rows={4}
            required
          />
          <Ariakit.FormError name={form.names.singleProject} className="error" />
        </div>
      )}
      {currentProjectType === beforeAfterLiveCodingProject && (
        <div className="field form-textarea-double">
          <Ariakit.FormLabel name={form.names.codeBlockOne}>
            Code block for the start of the performance
          </Ariakit.FormLabel>
          <FormTextarea
            name={String(form.names.codeBlockOne)}
            value={codeBlockOneValue}
            onChange={e => form.setValue('codeBlockOne', e.target.value)}
            placeholder="Add code you start with here..."
            className="form-textarea-codeblock-one"
            autoCapitalize="none"
            autoCorrect="off"
            rows={4}
            required
          />
          <Ariakit.FormError name={form.names.codeBlockOne} className="error" />
          <div is-="separator" direction-="horizontal"></div>
          <Ariakit.FormLabel name={form.names.codeBlockTwo}>
            Finished code
          </Ariakit.FormLabel>
          <FormTextarea
            name={String(form.names.codeBlockTwo)}
            value={codeBlockTwoValue}
            onChange={e => form.setValue('codeBlockTwo', e.target.value)}
            placeholder="Add the code you finish with here..."
            className="form-textarea-codeblock-two"
            autoCapitalize="none"
            autoCorrect="off"
            rows={4}
            required
          />
          <Ariakit.FormError name={form.names.codeBlockTwo} className="error" />
        </div>
      )}
      <div className="buttons">
        <Ariakit.FormSubmit className="button">Submit</Ariakit.FormSubmit>
      </div>
    </Ariakit.Form>
  )
}
;
