import React from 'react'
import * as Ariakit from '@ariakit/react'

export default function SubmitSnippetForm() {
  const form = Ariakit.useFormStore({
    defaultValues: {
      projectName: '',
      description: '',
      projectSoftware: '',
      projectType: '',
      codeBlock: '',
      audioUpload: '',
      youtubeLink: '',
    },
  })

  return (
    <Ariakit.Form
      store={form}
      aria-labelledby="add-new-snippet"
      className="form-wrapper"
      method="post"
      noValidate={true}
    >
      <div className="buttons">
        <Ariakit.FormSubmit className="button">Submit</Ariakit.FormSubmit>
      </div>
    </Ariakit.Form>
  )
}
