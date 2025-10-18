import React from 'react'
import * as Ariakit from '@ariakit/react'

// StringLike is an interface that has toString() and valueOf() methods
type StringLike = {
  toString: () => string
  valueOf: () => string
}

interface FormInputProps {
  'name': StringLike
  'value': string
  'onChange': (event: React.ChangeEvent<HTMLInputElement>) => void
  'type'?: string
  'placeholder'?: string
  'className'?: string
  'size-'?: string
  'data-test-id'?: string
  'autoComplete'?: string
  'autoCapitalize'?: string
  'required'?: boolean
  'title'?: string
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      name,
      value,
      onChange,
      type = 'text',
      placeholder,
      className = 'input',
      'size-': sizeAttr,
      'data-test-id': dataTestId,
      autoComplete = 'off',
      autoCapitalize = 'none',
      required = false,
      title,
    },
    ref,
  ) => {
    return (
      <Ariakit.FormInput
        ref={ref}
        value={value}
        onChange={onChange}
        type={type}
        name={name}
        placeholder={placeholder}
        className={className}
        size-={sizeAttr}
        data-test-id={dataTestId}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize}
        required={required}
        title={title}
      />
    )
  },
)

FormInput.displayName = 'FormInput'

export default FormInput
