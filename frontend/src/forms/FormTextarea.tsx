import React from 'react'

type FormTextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'onChange' | 'name'
> & {
  'name': string
  'value': string
  'onChange': (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  'autoCapitalize'?: 'none' | 'sentences' | 'words' | 'characters'
  'autoCorrect'?: 'on' | 'off'
  'data-test-id'?: string
}

/**
 * In the future use the data-test-id for PlayWright tests:
 * Example:
 * <FormTextarea
 *   name="description"
 *   value={value}
 *   onChange={handleChange}
 *   placeholder="Enter description"
 *   className="form-textarea"
 *   data-test-id="description-textarea"
 * />
 * / Target by data-test-id
 * await page.locator('[data-test-id="description-textarea"]').fill('My description')
 *
 * // Or use getByTestId
 * await page.getByTestId('description-textarea').fill('My description')
 */

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
      'data-test-id': dataTestId,
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
        data-test-id={dataTestId}
        {...rest}
      />
    )
  },
)

FormTextarea.displayName = 'FormTextarea'

export default FormTextarea
