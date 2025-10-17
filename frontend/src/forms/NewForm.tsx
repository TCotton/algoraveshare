import React, { useEffect, useState, useRef } from 'react'
import * as Ariakit from '@ariakit/react'
import { isEmptyString } from 'ramda-adjunct'
import { equals } from 'ramda'
import SelectForm from '../forms/SelectForm'
import FormTextarea from '../forms/FormTextarea'
import { getDescriptionHtml } from './description-text.ts'
import MusicNoteOne from './svgComponents/MusicNoteOne.tsx'
import MusicNoteTwo from './svgComponents/MusicNoteTwo.tsx'
import { validateAudioFileUpload } from '../libs/helper-functions.ts'

export default function NewForm() {
  // Use useState to track the current project software selection
  const [currentProjectSoftware, setCurrentProjectSoftware] = useState<string | null>(null)
  const [currentProjectType, setCurrentProjectType] = useState<string | null>(null)
  const [audioFiles, setAudioFiles] = useState<string[]>([]) // eslint-disable-line

  // Create a ref to access the MusicNoteOne SVG DOM element
  const musicNoteOneRef = useRef<SVGSVGElement>(null)
  const musicNoteTwoRef = useRef<SVGSVGElement>(null)

  const form = Ariakit.useFormStore({
    defaultValues: {
      projectName: '',
      description: '',
      singleProject: '',
      projectSoftware: '',
      projectType: '',
      codeBlockOne: '',
      codeBlockTwo: '',
      audioUpload: '',
      youtubeLink: '',
    },
  })

  const projectSoftwareDefault = 'Project software'
  const projectTypeDefault = 'Project type'
  const strudel = 'Strudel'
  const tidal = 'Tidal Cycles'
  const finishedProject = 'Finished Project'
  const beforeAfterLiveCodingProject = 'Before and After Live Coding Project'
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

    // Validate projectType
    if (isEmptyString(values.projectType) || equals(values.projectType, projectTypeDefault)) {
      form.setError('projectType', 'Please select a project type')
      hasError = true
    }
    else {
      form.setError('projectType', '')
    }

    // Validate projectName
    const name = String(values.projectName ?? '').trim()
    if (!name) {
      form.setError('projectName', 'A project name is required')
      hasError = true
    }
    else if (values.projectName.trim().length > 200) {
      form.setError('projectName', 'The project name must not be longer than 200 characters')
      hasError = true
    }
    else {
      form.setError('projectName', '')
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

    // Validate singleProject
    if (equals(finishedProject, currentProjectType) && isEmptyString(values.singleProject.trim())) {
      form.setError('singleProject', 'Don\'t forget to add your code!')
      hasError = true
    }
    else {
      form.setError('singleProject', '')
    }

    // Validate codeBlockOne
    if (equals(beforeAfterLiveCodingProject, currentProjectType) && isEmptyString(values.codeBlockOne.trim())) {
      form.setError('codeBlockOne', 'Don\'t forget to add your code!')
      hasError = true
    }
    else {
      form.setError('codeBlockOne', '')
    }

    // Validate codeBlockTwo
    if (equals(beforeAfterLiveCodingProject, currentProjectType) && isEmptyString(values.codeBlockTwo.trim())) {
      form.setError('codeBlockTwo', 'Don\'t forget to add your code!')
      hasError = true
    }
    else {
      form.setError('codeBlockTwo', '')
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

  // Call all hooks at the top level - never inside conditionals
  const descriptionValue = form.useValue('description')
  const singleProjectValue = form.useValue('singleProject')
  const codeBlockOneValue = form.useValue('codeBlockOne')
  const codeBlockTwoValue = form.useValue('codeBlockTwo')
  const youtubeLinkValue = form.useValue('youtubeLink')

  // Callback function that updates state when projectSoftware selection changes
  const projectSoftwareFn = (_label: string, value: string): void => {
    setCurrentProjectSoftware(value)
  }

  const projectTypeFn = (_label: string, value: string): void => {
    setCurrentProjectType(value)
  }

  // Handler to play the animation when mouse enters
  const startAnimationMusicNoteOne = () => {
    if (musicNoteOneRef.current) {
      // Query all path elements in the SVG
      const paths = musicNoteOneRef.current.querySelectorAll('path')

      // Set animation-play-state to 'running' for each path
      paths.forEach((path) => {
        (path as SVGPathElement).style.animationPlayState = 'running'
      })
    }
  }

  // Handler to stop the animation when mouse leaves
  const stopAnimationMusicNoteOne = () => {
    if (musicNoteOneRef.current) {
      // Query all path elements in the SVG
      const paths = musicNoteOneRef.current.querySelectorAll('path')

      // Set animation-play-state to 'paused' for each path
      paths.forEach((path) => {
        (path as SVGPathElement).style.animationPlayState = 'paused'
      })
    }
  }

  const startAnimationMusicNoteTwo = () => {
    if (musicNoteTwoRef.current) {
      // Query all path elements in the SVG
      const paths = musicNoteTwoRef.current.querySelectorAll('path')

      // Set animation-play-state to 'paused' for each path
      paths.forEach((path) => {
        (path as SVGPathElement).style.animationPlayState = 'running'
      })
    }
  }

  const stopAnimationMusicNoteTwo = () => {
    if (musicNoteTwoRef.current) {
      // Query all path elements in the SVG
      const paths = musicNoteTwoRef.current.querySelectorAll('path')

      // Set animation-play-state to 'paused' for each path
      paths.forEach((path) => {
        (path as SVGPathElement).style.animationPlayState = 'paused'
      })
    }
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

    const result = validateAudioFileUpload(audioFile.name, audioFilesAllowed)

    if (result) {
      // Save file details to state
      const audioFileDetails = JSON.stringify({
        lastModified: audioFile.lastModified,
        name: audioFile.name,
        size: audioFile.size,
        type: audioFile.type,
      })
      // Update state with the file details
      setAudioFiles([audioFileDetails])
      console.log('File details:', audioFileDetails)
    }

    // Set form value to trigger validation (handled by form.useValidate)
    form.setValue('audioUpload', audioFile.name)
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

  // Use form.useValidate to validate audioUpload field
  form.useValidate(() => {
    const audioFileName = form.getState().values.audioUpload

    // If no filename, no error
    if (!audioFileName) {
      form.setError('audioUpload', '')
      return
    }

    const result = validateAudioFileUpload(audioFileName, audioFilesAllowed)

    if (!result) {
      console.log('Validation: Invalid file type:', audioFileName)
      form.setError('audioUpload', 'Invalid file type. Only WAV, MP3, FLAC, AAC and OGG files are allowed.')
    }
    else {
      console.log('Validation: Valid file type:', audioFileName)
      form.setError('audioUpload', '')
    }
  })

  return (
    <Ariakit.Form
      store={form}
      aria-labelledby="add-new-participant"
      className="form-wrapper"
      method="post"
    >
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
          onMouseEnter={startAnimationMusicNoteOne}
          onMouseLeave={stopAnimationMusicNoteOne}
        />
        <Ariakit.FormError name={form.names.projectSoftware} className="error" />
      </div>
      <div className="field">
        <MusicNoteOne ref={musicNoteOneRef} />
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
          onMouseEnter={startAnimationMusicNoteTwo}
          onMouseLeave={stopAnimationMusicNoteTwo}
        />
        <Ariakit.FormError name={form.names.projectType} className="error" />
      </div>
      <div className="field">
        <MusicNoteTwo ref={musicNoteTwoRef} />
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
      <div className="field field-upload-audio" is-="typography-block" box-="round" shear-="top">
        <div is-="badge" variant-="background0">
          <Ariakit.FormLabel name={form.names.audioUpload}>
            Audio upload:
            accepts WAV, MP3, FLAC, AAC and OGG
          </Ariakit.FormLabel>
        </div>
        <Ariakit.FormInput
          type="file"
          name={form.names.audioUpload}
          placeholder="Audio file"
          className="input-audio-file"
          size-="large"
          accept={audioFilesAllowed}
          onChange={audioFileValidation}
        />
        <Ariakit.FormError name={form.names.audioUpload} className="error" />
      </div>
      <div className="field input-youtube-link" is-="typography-block" box-="round" shear-="top">
        <div is-="badge" variant-="background0">
          <Ariakit.FormLabel name={form.names.youtubeLink}>Add a URL of a relevant YouTube video</Ariakit.FormLabel>
        </div>
        <Ariakit.FormInput
          name="youtubeLink"
          value={youtubeLinkValue}
          onChange={event => form.setValue('youtubeLink', event.target.value)}
          placeholder="Link to YouTube video"
          className="youtube-link"
          autoCapitalize="none"
          autoComplete="off"
          size-="large"
        />
        <Ariakit.FormError name={form.names.youtubeLink} className="error" />
      </div>
      <div className="buttons">
        <Ariakit.FormSubmit className="button">Submit</Ariakit.FormSubmit>
      </div>
    </Ariakit.Form>
  )
}
;
