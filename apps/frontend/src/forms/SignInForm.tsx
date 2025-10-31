import * as Ariakit from '@ariakit/react'
import React from 'react'
import isEmail from 'validator/lib/isEmail'

import FormInput from './FormInput'

interface FormValues {
  email: string
  passwordOne: string
}

export default function SignInForm() {
  const form = Ariakit.useFormStore({
    defaultValues: {
      email: '',
      passwordOne: ''
    }
  })
  form.useSubmit((state: { values: FormValues }) => {
    const { values } = state

    let hasError = false

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
    if (!values.passwordOne || values.passwordOne.trim() === '') {
      form.setError('passwordOne', 'Please enter a password')
      hasError = true
    }
 else {
      form.setError('passwordOne', '')
    }

    if (hasError) {
      return
    }

    alert(JSON.stringify(values))
  })
  const emailValue = form.useValue('email')
  const passwordOneValue = form.useValue('passwordOne')

  return (
    <Ariakit.Form
      store={form}
      aria-labelledby='sign-in-form'
      className='form-wrapper sign-in-form'
      method='post'
      noValidate={true}
    >
      <div className='field field-signin-email'>
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
          autoComplete='username'
        />
        <Ariakit.FormError name={form.names.email} className='error' />
      </div>
      <div className='field field-signin-password-one'>
        <Ariakit.FormLabel name={form.names.passwordOne}>
          Password:
        </Ariakit.FormLabel>
        <FormInput
          value={passwordOneValue}
          onChange={(event) => form.setValue('passwordOne', event.target.value)}
          type='password'
          name={form.names.passwordOne}
          placeholder='Password'
          className='input'
          size-='large'
          data-testid='passwordOne'
          autoComplete='current-password'
        />
        <Ariakit.FormError name={form.names.passwordOne} className='error' />
      </div>
      <div className='buttons'>
        <Ariakit.FormSubmit className='button'>Submit</Ariakit.FormSubmit>
      </div>
    </Ariakit.Form>
  )
}
