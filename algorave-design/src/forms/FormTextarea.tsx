import React from 'react'

interface FormTextareaProps {
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder: string
  className: string
  rows?: number
  required?: boolean
  autoCapitalize?: string
  autoCorrect?: string
}

export default function FormTextarea({
  name,
  value,
  onChange,
  placeholder,
  className,
  rows = 4,
  required = false,
  autoCapitalize = 'none',
  autoCorrect = 'off',
}: FormTextareaProps) {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      autoCapitalize={autoCapitalize}
      autoCorrect={autoCorrect}
      rows={rows}
      required={required}
    />
  )
}
