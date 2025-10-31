import * as Ariakit from '@ariakit/react'
import { Equivalence, Redacted } from 'effect'
import React from 'react'
import isEmail from 'validator/lib/isEmail'
import isStrongPassword from 'validator/lib/isStrongPassword'

import FormInput from './FormInput'

interface FormValues {
  name: string
  email: string
  passwordOne: string
  passwordTwo: string
  portfolioUrl: string
  location: string
  mastodonUrl: string
  blueskyUrl: string
  linkedinUrl: string
  youtubeLink: string
}

export default function RegistrationForm() {
  const form = Ariakit.useFormStore({
    defaultValues: {
      name: '',
      email: '',
      passwordOne: '',
      passwordTwo: '',
      location: '',
      portfolioUrl: '',
      mastodonUrl: '',
      blueskyUrl: '',
      linkedinUrl: '',
      youtubeLink: ''
    }
  })

  form.useSubmit((state: { values: FormValues }) => {
    const { values } = state

    let hasError = false

    // Validate name
    if (!values.name || values.name.trim() === '') {
      form.setError('name', 'Please enter your name')
      hasError = true
    }
 else if (values.name.trim().length > 200) {
      form.setError('name', 'Your name must not be longer than 200 characters')
      hasError = true
    }
 else {
      form.setError('name', '')
    }

    // Validate email
    if (!values.email || values.email.trim() === '') {
      form.setError('email', 'Please enter a valid email address')
      hasError = true
    }
 else if (!isEmail(values.email)) {
      form.setError('email', 'Please enter a valid email address')
      hasError = true
    }
 else {
      form.setError('email', '')
    }

    // Validate passwordOne
    // Wrap passwords in Redacted to prevent accidental logging
    // Very basic and largley useless use of Effect Redacted
    // To be effective it would need to be part of an Effect schema

    const redactedPasswordOne = Redacted.make(values.passwordOne)
    const redactedPasswordTwo = Redacted.make(values.passwordTwo)

    if (!values.passwordOne || values.passwordOne.trim() === '') {
      form.setError('passwordOne', 'Please enter a password')
      hasError = true
    }
 else if (!isStrongPassword(values.passwordOne)) {
      console.log('not strong password')
      form.setError(
        'passwordOne',
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
      hasError = true
    }
 else {
      form.setError('passwordOne', '')
    }

    // Validate passwordTwo
    if (!values.passwordTwo || values.passwordTwo.trim() === '') {
      form.setError('passwordTwo', 'Please enter a password')
      hasError = true
    }
 else if (!Equivalence.string(Redacted.value(redactedPasswordOne), Redacted.value(redactedPasswordTwo))) {
      form.setError('passwordTwo', 'Passwords do not match')
      hasError = true
    }
 else {
      form.setError('passwordTwo', '')
    }

    // Validate correct URL for portfolioUrl
    if (values.portfolioUrl) {
      const portfolioUrl = String(values.portfolioUrl ?? '').trim()
      if (!URL.canParse(portfolioUrl)) {
        form.setError('portfolioUrl', 'Are you sure the URL is correct?')
        hasError = true
      }
 else {
        form.setError('portfolioUrl', '')
      }
    }

    // Validate correct URL for youtubeLink
    if (values.youtubeLink) {
      const youtubeLink = String(values.youtubeLink ?? '').trim()
      if (!URL.canParse(youtubeLink)) {
        form.setError('youtubeLink', 'Are you sure the URL is correct?')
        hasError = true
      }
 else {
        form.setError('youtubeLink', '')
      }
    }

    // Validate correct URL for mastodonUrl
    if (values.mastodonUrl) {
      const mastodonUrl = String(values.mastodonUrl ?? '').trim()
      if (!URL.canParse(mastodonUrl)) {
        form.setError('mastodonUrl', 'Are you sure the URL is correct?')
        hasError = true
      }
 else {
        form.setError('mastodonUrl', '')
      }
    }

    // Validate correct URL for blueskyUrl
    if (values.blueskyUrl) {
      const blueskyUrl = String(values.blueskyUrl ?? '').trim()
      if (!URL.canParse(blueskyUrl)) {
        form.setError('blueskyUrl', 'Are you sure the URL is correct?')
        hasError = true
      }
 else {
        form.setError('blueskyUrl', '')
      }
    }

    // Validate correct URL for linkedinUrl
    if (values.linkedinUrl) {
      const linkedinUrl = String(values.linkedinUrl ?? '').trim()
      if (!URL.canParse(linkedinUrl)) {
        form.setError('linkedinUrl', 'Are you sure the URL is correct?')
        hasError = true
      }
 else {
        form.setError('linkedinUrl', '')
      }
    }

    if (hasError) {
      return
    }

    alert(JSON.stringify(values))
  })
  const nameValue = form.useValue('name')
  const emailValue = form.useValue('email')
  const passwordOneValue = form.useValue('passwordOne')
  const passwordTwoValue = form.useValue('passwordTwo')
  const location = form.useValue('location')
  const portfolioUrl = form.useValue('portfolioUrl')
  const youtubeLink = form.useValue('youtubeLink')
  const mastodonUrl = form.useValue('mastodonUrl')
  const blueskyUrl = form.useValue('blueskyUrl')
  const linkedinUrl = form.useValue('linkedinUrl')
  return (
    <Ariakit.Form
      store={form}
      aria-labelledby='add-new-project'
      className='form-wrapper registration-form'
      method='post'
    >
      <div className='field field-registration-name'>
        <Ariakit.FormLabel name={form.names.name}>Name:</Ariakit.FormLabel>
        <FormInput
          value={nameValue}
          onChange={(event) => form.setValue('name', event.target.value)}
          type='text'
          name={form.names.name}
          placeholder='Your name'
          className='input'
          size-='large'
          data-testid='name'
          autoComplete='on'
        />
        <Ariakit.FormError name={form.names.name} className='error' />
      </div>
      <div className='field field-project-email'>
        <Ariakit.FormLabel name={form.names.email}>Email:</Ariakit.FormLabel>
        <FormInput
          value={emailValue}
          onChange={(event) => form.setValue('email', event.target.value)}
          type='email'
          name={form.names.email}
          placeholder='Email address'
          className='input'
          size-='large'
          data-testid='email'
          autoComplete='on'
        />
        <Ariakit.FormError name={form.names.email} className='error' />
      </div>
      <div className='field field-registration-password-one'>
        <Ariakit.FormLabel name={form.names.passwordOne}>
          Password:
          <span>
            The password must be at least 8 characters long and contain at least one uppercase letter, one lowercase
            letter, one number, and one special character.
          </span>
        </Ariakit.FormLabel>
        <FormInput
          value={passwordOneValue}
          onChange={(event) => form.setValue('passwordOne', event.target.value)}
          type='password'
          name={form.names.passwordOne}
          placeholder='Example of passwords: +r)47S+n@B, GEa8^n%qxsg*, W7r9!FAT'
          className='input'
          size-='large'
          data-testid='passwordOne'
          autoComplete='new-password'
          title='Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
        />
        <Ariakit.FormError name={form.names.passwordOne} className='error' />
      </div>
      <div className='field field-registration-password-two'>
        <Ariakit.FormLabel name={form.names.passwordTwo}>
          Please type the same password again.
        </Ariakit.FormLabel>
        <FormInput
          value={passwordTwoValue}
          onChange={(event) => form.setValue('passwordTwo', event.target.value)}
          type='password'
          name={form.names.passwordTwo}
          placeholder='Must match the first password'
          className='input'
          size-='large'
          data-testid='passwordTwo'
          autoComplete='new-password'
        />
        <Ariakit.FormError name={form.names.passwordTwo} className='error' />
      </div>
      <div className='field field-registration-location'>
        <Ariakit.FormLabel name={form.names.location}>
          Add your town, city or country
        </Ariakit.FormLabel>
        <FormInput
          value={location}
          onChange={(event) => form.setValue('location', event.target.value)}
          type='text'
          name={form.names.location}
          placeholder='Add your town, city or country'
          className='input'
          size-='large'
          data-testid='location'
          autoComplete='on'
          autoCapitalize='on'
        />
        <Ariakit.FormError name={form.names.location} className='error' />
      </div>
      <div className='field field-registration-portfolioUrl'>
        <Ariakit.FormLabel name={form.names.portfolioUrl}>
          Add a link to your portfolio
        </Ariakit.FormLabel>
        <FormInput
          value={portfolioUrl}
          onChange={(event) => form.setValue('portfolioUrl', event.target.value)}
          type='url'
          name={form.names.portfolioUrl}
          placeholder='Add a link to you portfolio'
          className='input'
          size-='large'
          data-testid='portfolioUrl'
          autoCapitalize='off'
        />
        <Ariakit.FormError name={form.names.portfolioUrl} className='error' />
      </div>
      <div className='field field-registration-youtubeLink'>
        <Ariakit.FormLabel name={form.names.youtubeLink}>
          Add a link to your YouTube channel
        </Ariakit.FormLabel>
        <FormInput
          value={youtubeLink}
          onChange={(event) => form.setValue('youtubeLink', event.target.value)}
          type='url'
          name={form.names.youtubeLink}
          placeholder='Add a link to your YouTube channel'
          className='input'
          size-='large'
          data-testid='youtubeLink'
          autoCapitalize='off'
        />
        <Ariakit.FormError name={form.names.youtubeLink} className='error' />
      </div>
      <div className='field field-registration-youtubeLink'>
        <Ariakit.FormLabel name={form.names.mastodonUrl}>
          Add a link to your Mastodon account
        </Ariakit.FormLabel>
        <FormInput
          value={mastodonUrl}
          onChange={(event) => form.setValue('mastodonUrl', event.target.value)}
          type='url'
          name={form.names.mastodonUrl}
          placeholder='Add a link to your Mastodon account'
          className='input'
          size-='large'
          data-testid='mastodonUrl'
          autoCapitalize='off'
        />
        <Ariakit.FormError name={form.names.mastodonUrl} className='error' />
      </div>
      <div className='field field-registration-blueskyUrl'>
        <Ariakit.FormLabel name={form.names.blueskyUrl}>
          Add a link to your Bluesky account
        </Ariakit.FormLabel>
        <FormInput
          value={blueskyUrl}
          onChange={(event) => form.setValue('blueskyUrl', event.target.value)}
          type='url'
          name={form.names.blueskyUrl}
          placeholder='Add a link to your Bluesky account'
          className='input'
          size-='large'
          data-testid='blueskyUrl'
          autoCapitalize='off'
        />
        <Ariakit.FormError name={form.names.blueskyUrl} className='error' />
      </div>
      <div className='field field-registration-linkedinUrl'>
        <Ariakit.FormLabel name={form.names.linkedinUrl}>
          Add a link to your LinkedIn account
        </Ariakit.FormLabel>
        <FormInput
          value={linkedinUrl}
          onChange={(event) => form.setValue('linkedinUrl', event.target.value)}
          type='url'
          name={form.names.linkedinUrl}
          placeholder='Add a link to your LinkedIn account'
          className='input'
          size-='large'
          data-testid='linkedinUrl'
          autoCapitalize='off'
        />
        <Ariakit.FormError name={form.names.linkedinUrl} className='error' />
      </div>
      <div className='buttons'>
        <Ariakit.FormSubmit className='button'>Submit</Ariakit.FormSubmit>
      </div>
    </Ariakit.Form>
  )
}
