import React from 'react'

type FormTextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'onChange' | 'name'
> & {
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  autoCorrect?: 'on' | 'off'
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      name,
      value,
      onChange,
      placeholder,
      className,
      rows = 4,
      required = false,
      autoCapitalize = 'none',
      autoCorrect = 'off',
      ...rest
    },
    ref,
  ) => {
    return (
      <textarea
        ref={ref}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        rows={rows}
        required={required}
        {...rest}
      />
    )
  },
)

FormTextarea.displayName = 'FormTextarea'

export default FormTextarea
