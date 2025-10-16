import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FormTextarea from '../../../../src/forms/FormTextarea'

describe('FormTextarea', () => {
  it('renders textarea with correct attributes', () => {
    const mockOnChange = vi.fn()

    render(
      <FormTextarea
        name="testTextarea"
        value=""
        onChange={mockOnChange}
        placeholder="Enter text here"
        className="test-textarea"
        rows={5}
        required
      />,
    )

    const textarea = screen.getByPlaceholderText('Enter text here')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveAttribute('name', 'testTextarea')
    expect(textarea).toHaveAttribute('placeholder', 'Enter text here')
    expect(textarea).toHaveClass('test-textarea')
    expect(textarea).toHaveAttribute('rows', '5')
    expect(textarea).toHaveAttribute('required')
  })

  it('renders with default values when optional props are not provided', () => {
    const mockOnChange = vi.fn()

    render(
      <FormTextarea
        name="testTextarea"
        value=""
        onChange={mockOnChange}
        placeholder="Test"
        className="test-class"
      />,
    )

    const textarea = screen.getByPlaceholderText('Test')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveAttribute('rows', '4') // default value
    expect(textarea).toHaveAttribute('autocapitalize', 'none') // default value
    expect(textarea).toHaveAttribute('autocorrect', 'off') // default value
    expect(textarea).not.toHaveAttribute('required')
  })

  it('displays the provided value', () => {
    const mockOnChange = vi.fn()
    const testValue = 'This is test content'

    render(
      <FormTextarea
        name="testTextarea"
        value={testValue}
        onChange={mockOnChange}
        placeholder="Test"
        className="test-class"
      />,
    )

    const textarea = screen.getByDisplayValue(testValue)
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveValue(testValue)
  })

  it('calls onChange handler when text is entered', () => {
    const mockOnChange = vi.fn()

    render(
      <FormTextarea
        name="testTextarea"
        value=""
        onChange={mockOnChange}
        placeholder="Enter text"
        className="test-class"
      />,
    )

    const textarea = screen.getByPlaceholderText('Enter text')
    fireEvent.change(textarea, { target: { value: 'New text content' } })

    expect(mockOnChange).toHaveBeenCalledTimes(1)
  })

  it('supports custom autoCapitalize and autoCorrect values', () => {
    const mockOnChange = vi.fn()

    render(
      <FormTextarea
        name="testTextarea"
        value=""
        onChange={mockOnChange}
        placeholder="Test"
        className="test-class"
        autoCapitalize="sentences"
        autoCorrect="on"
      />,
    )

    const textarea = screen.getByPlaceholderText('Test')
    expect(textarea).toHaveAttribute('autocapitalize', 'sentences')
    expect(textarea).toHaveAttribute('autocorrect', 'on')
  })

  it('renders with description textarea configuration', () => {
    const mockOnChange = vi.fn()

    render(
      <FormTextarea
        name="description"
        value=""
        onChange={mockOnChange}
        placeholder="Describe the project..."
        className="form-textarea"
        autoCapitalize="none"
        autoCorrect="off"
        rows={4}
        required
      />,
    )

    const textarea = screen.getByPlaceholderText('Describe the project...')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveAttribute('name', 'description')
    expect(textarea).toHaveClass('form-textarea')
  })

  it('renders with codeblock configuration', () => {
    const mockOnChange = vi.fn()

    render(
      <FormTextarea
        name="singleProject"
        value=""
        onChange={mockOnChange}
        placeholder="Add code here..."
        className="form-single-codeblock"
        autoCapitalize="none"
        autoCorrect="off"
        rows={4}
        required
      />,
    )

    const textarea = screen.getByPlaceholderText('Add code here...')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveAttribute('name', 'singleProject')
    expect(textarea).toHaveClass('form-single-codeblock')
  })

  it('matches snapshot', () => {
    const mockOnChange = vi.fn()

    const { container } = render(
      <FormTextarea
        name="testTextarea"
        value="Test value"
        onChange={mockOnChange}
        placeholder="Test placeholder"
        className="test-class"
        rows={4}
        required
      />,
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  it('forwards ref correctly', () => {
    const mockOnChange = vi.fn()
    const ref = React.createRef<HTMLTextAreaElement>()

    render(
      <FormTextarea
        ref={ref}
        name="testTextarea"
        value=""
        onChange={mockOnChange}
        placeholder="Test"
        className="test-class"
      />,
    )

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
    expect(ref.current).toHaveAttribute('name', 'testTextarea')
  })

  it('accepts additional HTML textarea attributes via rest props', () => {
    const mockOnChange = vi.fn()

    render(
      <FormTextarea
        name="testTextarea"
        value=""
        onChange={mockOnChange}
        placeholder="Test"
        className="test-class"
        id="custom-id"
        disabled
        maxLength={100}
        spellCheck={false}
        data-testid="custom-textarea"
        aria-label="Custom textarea"
      />,
    )

    const textarea = screen.getByTestId('custom-textarea')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveAttribute('id', 'custom-id')
    expect(textarea).toBeDisabled()
    expect(textarea).toHaveAttribute('maxLength', '100')
    expect(textarea).toHaveAttribute('spellCheck', 'false')
    expect(textarea).toHaveAttribute('aria-label', 'Custom textarea')
  })

  it('supports imperative focus via ref', () => {
    const mockOnChange = vi.fn()
    const ref = React.createRef<HTMLTextAreaElement>()

    render(
      <FormTextarea
        ref={ref}
        name="testTextarea"
        value=""
        onChange={mockOnChange}
        placeholder="Test"
        className="test-class"
      />,
    )

    // Simulate imperative focus
    ref.current?.focus()
    expect(ref.current).toHaveFocus()
  })
})
