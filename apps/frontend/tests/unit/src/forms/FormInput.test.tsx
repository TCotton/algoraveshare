import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import FormInput from '../../../../src/forms/FormInput'

// Mock Ariakit
vi.mock('@ariakit/react', () => ({
  FormInput: ({ children, ...props }: any) => <input {...props}>{children}</input>
}))

describe('FormInput', () => {
  const mockOnChange = vi.fn()
  const mockName = {
    toString: () => 'testField',
    valueOf: () => 'testField'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with required props', () => {
    render(
      <FormInput
        name={mockName}
        value='test value'
        onChange={mockOnChange}
      />
    )

    const input = screen.getByDisplayValue('test value')
    expect(input).toBeInTheDocument()
  })

  it('renders with all optional props', () => {
    render(
      <FormInput
        name={mockName}
        value='test'
        onChange={mockOnChange}
        type='email'
        placeholder='Enter email'
        className='custom-input'
        size-='medium'
        data-testid='email-input'
        autoComplete='email'
        autoCapitalize='off'
        required={true}
      />
    )

    const input = screen.getByPlaceholderText('Enter email')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('custom-input')
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toHaveAttribute('data-testid', 'email-input')
    expect(input).toHaveAttribute('autocomplete', 'email')
    expect(input).toHaveAttribute('autocapitalize', 'off')
    expect(input).toBeRequired()
  })

  it('applies default props when not provided', () => {
    render(
      <FormInput
        name={mockName}
        value='test'
        onChange={mockOnChange}
      />
    )

    const input = screen.getByDisplayValue('test')
    expect(input).toHaveAttribute('type', 'text')
    expect(input).toHaveClass('input')
    expect(input).toHaveAttribute('autocomplete', 'off')
    expect(input).toHaveAttribute('autocapitalize', 'none')
    expect(input).not.toBeRequired()
  })

  it('calls onChange handler when value changes', () => {
    render(
      <FormInput
        name={mockName}
        value=''
        onChange={mockOnChange}
        placeholder='Type here'
      />
    )

    const input = screen.getByPlaceholderText('Type here')
    fireEvent.change(input, { target: { value: 'a' } })

    expect(mockOnChange).toHaveBeenCalled()
  })

  it('renders with data-testid for testing purposes', () => {
    render(
      <FormInput
        name={mockName}
        value='test'
        onChange={mockOnChange}
        data-testid='my-input'
      />
    )

    const input = screen.getByDisplayValue('test')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('data-testid', 'my-input')
  })

  it('handles different input types', () => {
    const { rerender } = render(
      <FormInput
        name={mockName}
        value='test'
        onChange={mockOnChange}
        type='text'
      />
    )

    let input = screen.getByDisplayValue('test')
    expect(input).toHaveAttribute('type', 'text')

    rerender(
      <FormInput
        name={mockName}
        value='test@example.com'
        onChange={mockOnChange}
        type='email'
      />
    )

    input = screen.getByDisplayValue('test@example.com')
    expect(input).toHaveAttribute('type', 'email')

    rerender(
      <FormInput
        name={mockName}
        value='password123'
        onChange={mockOnChange}
        type='password'
      />
    )

    input = screen.getByDisplayValue('password123')
    expect(input).toHaveAttribute('type', 'password')
  })

  it('accepts custom className', () => {
    render(
      <FormInput
        name={mockName}
        value='test'
        onChange={mockOnChange}
        className='my-custom-class'
      />
    )

    const input = screen.getByDisplayValue('test')
    expect(input).toHaveClass('my-custom-class')
  })

  it('renders with placeholder text', () => {
    render(
      <FormInput
        name={mockName}
        value=''
        onChange={mockOnChange}
        placeholder='Enter your name'
      />
    )

    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
  })
})
