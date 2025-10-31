import * as Ariakit from '@ariakit/react'
import React from 'react'

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
  'data-testid'?: string
  'autoComplete'?: string
  'autoCapitalize'?: string
  'required'?: boolean
  'title'?: string
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      autoCapitalize = 'none',
      autoComplete = 'off',
      className = 'input',
      'data-testid': dataTestId,
      name,
      onChange,
      placeholder,
      required = false,
      'size-': sizeAttr,
      title,
      type = 'text',
      value
    },
    ref
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
        data-testid={dataTestId}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize}
        required={required}
        title={title}
      />
    )
  }
)

FormInput.displayName = 'FormInput'

export default FormInput
