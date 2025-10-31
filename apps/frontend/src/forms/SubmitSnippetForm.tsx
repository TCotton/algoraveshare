import * as Ariakit from '@ariakit/react'
import { equals } from 'ramda'
import { isEmptyString } from 'ramda-adjunct'
import React, { useState } from 'react'
import sanitize from 'sanitize-filename'

import FormTextarea from '../forms/FormTextarea'
import SelectForm from '../forms/SelectForm'
import { validateAudioFileUpload } from '../libs/helper-functions.ts'
import { getDescriptionHtml } from './description-text.ts'
import FormInput from './FormInput'

export default function SubmitSnippetForm() {
  const [currentProjectSoftware, setCurrentProjectSoftware] = useState<string | null>(null)
    const [audioFiles, setAudioFiles] = useState<string[]>([]) // eslint-disable-line

  const form = Ariakit.useFormStore({
    defaultValues: {
      snippetName: '',
      description: '',
      projectSoftware: '',
      codeBlock: '',
      audioUpload: '',
      youtubeLink: ''
    }
  })

  const projectSoftwareDefault = 'Project software'
  const strudel = 'Strudel'
  const tidal = 'Tidal Cycles'
  const audioFilesAllowed = '\'audio/wav\', \'audio/mp3\', \'audio/flac\', \'audio/aac\', \'audio/ogg\''

  form.useSubmit((state) => {
    console.info(state)
    const { values } = state
    console.info(values)
    let hasError = false

    // Validate projectSoftware
    if (isEmptyString(values.projectSoftware) || equals(values.projectSoftware, projectSoftwareDefault)) {
      form.setError('projectSoftware', 'Please select the project software')
      hasError = true
    }
 else {
      form.setError('projectSoftware', '')
    }

    // Validate snippetName
    const name = String(values.snippetName ?? '').trim()
    if (!name) {
      form.setError('snippetName', 'A snippet title is required')
      hasError = true
    }
 else if (values.snippetName.trim().length > 200) {
      form.setError('snippetName', 'The project name must not be longer than 200 characters')
      hasError = true
    }
 else {
      form.setError('snippetName', '')
    }

    // Validate description
    const desc = String(values.description ?? '').trim()
    if (!desc) {
      form.setError('description', 'Description is required')
      hasError = true
    }
 else {
      form.setError('description', '')
    }

    // Validate codeBlock
    if (isEmptyString(values.codeBlock.trim())) {
      form.setError('codeBlock', 'Don\'t forget to add your code!')
      hasError = true
    }

    // Validate audioUpload
    if (values.audioUpload) {
      const audioFileName = form.getState().values.audioUpload
      const result = validateAudioFileUpload(audioFileName, audioFilesAllowed)
      if (!result) {
        console.log('Validation: Invalid file type:', audioFileName)
        form.setError('audioUpload', 'Invalid file type. Only WAV, MP3, FLAC, AAC and OGG files are allowed.')
        hasError = true
      }
 else {
        console.log('Validation: Valid file type:', audioFileName)
        form.setError('audioUpload', '')
      }
      console.dir(audioFileName)
    }

    // Validate youtubeLink
    if (values.youtubeLink) {
      const youtubeLink = String(values.youtubeLink ?? '').trim()
      if (!URL.canParse(youtubeLink)) {
        form.setError('youtubeLink', 'Are you sure that URL is correct?')
        hasError = true
      }
 else {
        form.setError('youtubeLink', '')
      }
    }

    if (hasError) {
      return
    }

    alert(JSON.stringify(values))
  })

  const projectSoftwareFn = (_label: string, value: string): void => {
    setCurrentProjectSoftware(value)
  }

  const audioFileValidation = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audioFile = event.target.files?.[0]

    // Mark the field as touched so errors will display
    form.setTouched({ audioUpload: true })

    // If no file is selected, clear state and form value
    if (!audioFile) {
      form.setValue('audioUpload', '')
      setAudioFiles([])
      return
    }

    const result = validateAudioFileUpload(sanitize(audioFile.name), audioFilesAllowed)

    if (result) {
      // Save file details to state
      const audioFileDetails = JSON.stringify({
        lastModified: audioFile.lastModified,
        name: sanitize(audioFile.name),
        size: audioFile.size,
        type: audioFile.type
      })
      // Update state with the file details
      setAudioFiles([audioFileDetails])
      console.log('File details:', audioFileDetails)
    }

    // Set form value to trigger validation (handled by form.useValidate)
    form.setValue('audioUpload', sanitize(audioFile.name))
  }

  const snippetNameValue = form.useValue('snippetName')
  const descriptionValue = form.useValue('description')
  const codeBlockValue = form.useValue('codeBlock')
  const audioUploadValue = form.useValue('audioUpload')
  const youtubeLinkValue = form.useValue('youtubeLink')

  return (
    <Ariakit.Form
      store={form}
      aria-labelledby='add-new-snippet'
      className='form-wrapper submit-snippet-form'
      method='post'
      noValidate={true}
    >
      <div className='field field-registration-name'>
        <Ariakit.FormLabel name={form.names.snippetName}>Snippet title:</Ariakit.FormLabel>
        <FormInput
          value={snippetNameValue}
          onChange={(event) => form.setValue('snippetName', event.target.value)}
          type='text'
          name={form.names.snippetName}
          placeholder='Title for snippet'
          className='input'
          size-='large'
          data-testid='name'
          autoComplete='on'
        />
        <Ariakit.FormError name={form.names.snippetName} className='error' />
      </div>
      <div className='field field-project-software'>
        <SelectForm
          label='Choose the project software'
          name='projectSoftware'
          form={form}
          items={[
            { value: projectSoftwareDefault, label: 'project-software' },
            { value: 'Tidal Cycles', label: 'tidal-cycles' },
            { value: 'Strudel', label: 'strudel' }
          ]}
          selectClass='project-software'
          onChange={projectSoftwareFn}
        />
        <Ariakit.FormError name={form.names.projectSoftware} className='error' />
      </div>
      <div className='field form-textarea form-codeblock'>
        <Ariakit.FormLabel name={form.names.codeBlock}>
          Code block
        </Ariakit.FormLabel>
        <FormTextarea
          name={String(form.names.codeBlock)}
          value={codeBlockValue}
          onChange={(e) => form.setValue('codeBlock', e.target.value)}
          placeholder='Add code here...'
          className='form-codeblock'
          autoCapitalize='none'
          autoCorrect='off'
          data-testid='codeBlock'
          rows={4}
        />
        <Ariakit.FormError name={form.names.codeBlock} className='error' />
      </div>
      {(currentProjectSoftware === strudel || currentProjectSoftware === tidal) && (
        <div className='field form-textarea'>
          <Ariakit.FormLabel name={form.names.description}>
            Description
          </Ariakit.FormLabel>
          <div className='description-text'>
            <p>When writing your description, consider addressing some of the following questions:</p>
            <div
              dangerouslySetInnerHTML={{ __html: getDescriptionHtml(currentProjectSoftware) }}
            />
          </div>
          <FormTextarea
            name={String(form.names.description)}
            value={descriptionValue}
            onChange={(e) => form.setValue('description', e.target.value)}
            placeholder='Add description here...'
            className='form-description'
            autoCapitalize='none'
            autoCorrect='off'
            data-testid='description'
            rows={4}
          />
          <Ariakit.FormError name={form.names.description} className='error' />
        </div>
      )}
      <div className='field field-upload-audio' is-='typography-block' box-='round' shear-='top'>
        <div is-='badge' variant-='background0'>
          <Ariakit.FormLabel name={form.names.audioUpload}>
            Audio upload: <br />accepts WAV, MP3, FLAC, AAC and OGG
          </Ariakit.FormLabel>
        </div>
        <FormInput
          value={audioUploadValue}
          onChange={audioFileValidation}
          type='file'
          name={form.names.audioUpload}
          placeholder='Audio file'
          className='input-audio-file'
          size-='large'
          data-testid='audio-file-upload'
        />
        <Ariakit.FormError name={form.names.audioUpload} className='error' />
      </div>
      <div className='field input-youtube-link' is-='typography-block' box-='round' shear-='top'>
        <div is-='badge' variant-='background0'>
          <Ariakit.FormLabel name={form.names.youtubeLink}>Add a URL of a relevant YouTube video</Ariakit.FormLabel>
        </div>
        <Ariakit.FormInput
          name='youtubeLink'
          value={youtubeLinkValue}
          onChange={(event) => form.setValue('youtubeLink', event.target.value)}
          placeholder='Link to YouTube video'
          className='youtube-link'
          autoCapitalize='none'
          autoComplete='off'
          size-='large'
        />
        <Ariakit.FormError name={form.names.youtubeLink} className='error' />
      </div>
      <div className='buttons'>
        <Ariakit.FormSubmit className='button'>Submit</Ariakit.FormSubmit>
      </div>
    </Ariakit.Form>
  )
}
