import React from 'react'

type FormTextareaProps =
  & Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    'value' | 'onChange' | 'name'
  >
  & {
    'name': string
    'value': string
    'onChange': (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    'autoCapitalize'?: 'none' | 'sentences' | 'words' | 'characters'
    'autoCorrect'?: 'on' | 'off'
    'data-testid'?: string
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
      autoCapitalize = 'none',
      autoCorrect = 'off',
      className,
      'data-testid': dataTestId,
      name,
      onChange,
      placeholder,
      required = false,
      rows = 4,
      value,
      ...rest
    },
    ref
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
        data-testid={dataTestId}
        {...rest}
      />
    )
  }
)

FormTextarea.displayName = 'FormTextarea'

export default FormTextarea
