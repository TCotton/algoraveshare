import React from 'react'
import * as Ariakit from '@ariakit/react'

const projectSoftwareDefault = 'Select software'
const projectTypeDefault = 'Select type'

export default function ProjectForm() {
  const form = Ariakit.useFormStore({
    defaultValues: {
      projectName: '',
      description: '',
      singleProject: false,
      projectSoftware: projectSoftwareDefault,
      projectType: projectTypeDefault,
    },
  })

  // 🔍 Validation logic per field
  const validateField = (field: string, values: Record<string, any>) => {
    const value = values[field]
    let error = ''

    switch (field) {
      case 'projectSoftware':
        if (value === '' || value === projectSoftwareDefault) {
          error = 'Please select a project software'
        }

        break

      case 'projectType':
        if (value === '' || value === projectTypeDefault) {
          error = 'Please select a project type'
        }

        break

      case 'projectName':
        if (!String(value || '').trim()) {
          error = 'Name is required'
        }

        else if (value.trim().length > 200) {
          error = 'The project name must not be longer than 200 characters'
        }

        break

      case 'description':
        if (!String(value || '').trim()) {
          error = 'Description is required'
        }

        break

      case 'singleProject':
        if (!value) {
          error = 'Don\'t forget to add your code!'
        }

        break
    }

    form.setError(field, error)
    return !error // true if valid
  }

  // 🧩 On submit, validate all fields
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const values = form.getState().values
    const fields = [
      'projectName',
      'description',
      'singleProject',
      'projectSoftware',
      'projectType',
    ]

    let hasError = false
    for (const field of fields) {
      const valid = validateField(field, values)
      if (!valid) {
        hasError = true
      }
    }

    if (hasError) {
      return
    }
    alert(JSON.stringify(values, null, 2))
  }

  // 🧠 Validate on blur (field-level persistence)
  const handleBlur = (field: string) => {
    const values = form.getState().values
    validateField(field, values)
  }

  return (
    <Ariakit.Form store={form} onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4 border rounded-xl shadow">
      <h2 className="text-xl font-semibold">Create Project</h2>

      {/* Project name */}
      <div>
        <label className="block font-medium">Project Name</label>
        <Ariakit.FormInput
          name="projectName"
          onBlur={() => handleBlur('projectName')}
          className="w-full border rounded p-2"
          placeholder="Enter project name"
        />
        <Ariakit.FormError name="projectName" className="text-red-600 text-sm mt-1" />
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium">Description</label>
        <textarea
          name="description"
          rows={3}
          onBlur={() => handleBlur('description')}
          className="w-full border rounded p-2"
          placeholder="Describe your project"
          value={form.useValue('description')}
        />
        <Ariakit.FormError name="description" className="text-red-600 text-sm mt-1" />
      </div>

      {/* Project Software */}
      <div>
        <label className="block font-medium">Software</label>
        <select
          name="projectSoftware"
          onBlur={() => handleBlur('projectSoftware')}
          className="w-full border rounded p-2"
          value={form.useValue('projectSoftware')}
        >
          <option>{projectSoftwareDefault}</option>
          <option>TidalCycles</option>
          <option>Strudel</option>
        </select>
        <Ariakit.FormError name="projectSoftware" className="text-red-600 text-sm mt-1" />
      </div>

      {/* Project Type */}
      <div>
        <label className="block font-medium">Project Type</label>
        <select
          name="projectType"
          onBlur={() => handleBlur('projectType')}
          className="w-full border rounded p-2"
          value={form.useValue('projectType')}
        >
          <option>{projectTypeDefault}</option>
          <option>Snippet</option>
          <option>Full Project</option>
        </select>
        <Ariakit.FormError name="projectType" className="text-red-600 text-sm mt-1" />
      </div>

      {/* Single Project Checkbox */}
      <div className="flex items-center space-x-2">
        <Ariakit.FormCheckbox
          name="singleProject"
          onBlur={() => handleBlur('singleProject')}
          className="border"
        />
        <label>Add code snippet</label>
      </div>
      <Ariakit.FormError name="singleProject" className="text-red-600 text-sm mt-1" />

      {/* Submit */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </Ariakit.Form>
  )
}
