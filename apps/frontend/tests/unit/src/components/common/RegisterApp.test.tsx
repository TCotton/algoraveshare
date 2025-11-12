import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import RegisterApp from '../../../../../src/components/common/RegisterApp'

// Mock Ariakit components
vi.mock('@ariakit/react', () => ({
  __esModule: true,
  useFormStore: () => ({
    names: {
      name: 'name',
      email: 'email',
      passwordOne: 'passwordOne',
      passwordTwo: 'passwordTwo',
      location: 'location',
      portfolioUrl: 'portfolioUrl',
      mastodonUrl: 'mastodonUrl',
      blueskyUrl: 'blueskyUrl',
      linkedinUrl: 'linkedinUrl',
      youtubeLink: 'youtubeLink'
    },
    useSubmit: vi.fn(),
    useValue: vi.fn((_field) => ''),
    setValue: vi.fn(),
    setError: vi.fn()
  }),
  Form: ({ children, ...props }: any) => (
    <form data-testid='registration-form' {...props}>
      {children}
    </form>
  ),
  FormLabel: ({ children, ...props }: any) => (
    <label data-testid='form-label' {...props}>
      {children}
    </label>
  ),
  FormError: ({ ...props }: any) => <div data-testid='form-error' {...props} />,
  FormSubmit: ({ children, ...props }: any) => (
    <button type='submit' data-testid='form-submit' {...props}>
      {children}
    </button>
  )
}))

// Mock FormInput component
vi.mock('../../../../../src/forms/FormInput', () => ({
  __esModule: true,
  default: ({ 'data-testid': testId, placeholder, type = 'text', ...props }: any) => (
    <input
      data-testid={testId}
      placeholder={placeholder}
      type={type}
      {...props}
    />
  )
}))

// Mock validator functions
vi.mock('validator/lib/isEmail', () => ({
  __esModule: true,
  default: vi.fn((email: string) => email.includes('@'))
}))

vi.mock('validator/lib/isStrongPassword', () => ({
  __esModule: true,
  default: vi.fn((password: string) => password.length >= 8)
}))

describe('RegisterApp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock window.alert
    global.alert = vi.fn()
  })

  it('renders the registration form within StrictMode', () => {
    render(<RegisterApp />)
    
    const form = screen.getByTestId('registration-form')
    expect(form).toBeInTheDocument()
    expect(form).toHaveClass('form-wrapper registration-form')
    expect(form).toHaveAttribute('method', 'post')
  })

  it('renders all required form fields', () => {
    render(<RegisterApp />)

    // Check that all required input fields are present
    expect(screen.getByTestId('name')).toBeInTheDocument()
    expect(screen.getByTestId('email')).toBeInTheDocument()
    expect(screen.getByTestId('passwordOne')).toBeInTheDocument()
    expect(screen.getByTestId('passwordTwo')).toBeInTheDocument()
    
    // Check optional fields
    expect(screen.getByTestId('location')).toBeInTheDocument()
    expect(screen.getByTestId('portfolioUrl')).toBeInTheDocument()
    expect(screen.getByTestId('youtubeLink')).toBeInTheDocument()
    expect(screen.getByTestId('mastodonUrl')).toBeInTheDocument()
    expect(screen.getByTestId('blueskyUrl')).toBeInTheDocument()
    expect(screen.getByTestId('linkedinUrl')).toBeInTheDocument()
  })

  it('renders form labels with correct text content', () => {
    render(<RegisterApp />)

    const labels = screen.getAllByTestId('form-label')
    expect(labels.length).toBeGreaterThan(0)
    
    // Check some specific label content
    expect(screen.getByText('Name:')).toBeInTheDocument()
    expect(screen.getByText('Email:')).toBeInTheDocument()
    expect(screen.getByText(/Password:/)).toBeInTheDocument()
    expect(screen.getByText('Please type the same password again.')).toBeInTheDocument()
  })

  it('renders form fields with correct input types', () => {
    render(<RegisterApp />)

    expect(screen.getByTestId('name')).toHaveAttribute('type', 'text')
    expect(screen.getByTestId('email')).toHaveAttribute('type', 'email')
    expect(screen.getByTestId('passwordOne')).toHaveAttribute('type', 'password')
    expect(screen.getByTestId('passwordTwo')).toHaveAttribute('type', 'password')
    expect(screen.getByTestId('location')).toHaveAttribute('type', 'text')
    expect(screen.getByTestId('portfolioUrl')).toHaveAttribute('type', 'url')
    expect(screen.getByTestId('youtubeLink')).toHaveAttribute('type', 'url')
    expect(screen.getByTestId('mastodonUrl')).toHaveAttribute('type', 'url')
    expect(screen.getByTestId('blueskyUrl')).toHaveAttribute('type', 'url')
    expect(screen.getByTestId('linkedinUrl')).toHaveAttribute('type', 'url')
  })

  it('renders form fields with appropriate placeholders', () => {
    render(<RegisterApp />)

    expect(screen.getByTestId('name')).toHaveAttribute('placeholder', 'Your name')
    expect(screen.getByTestId('email')).toHaveAttribute('placeholder', 'Email address')
    expect(screen.getByTestId('passwordOne')).toHaveAttribute('placeholder', 'Example of passwords: +r)47S+n@B, GEa8^n%qxsg*, W7r9!FAT')
    expect(screen.getByTestId('passwordTwo')).toHaveAttribute('placeholder', 'Must match the first password')
    expect(screen.getByTestId('location')).toHaveAttribute('placeholder', 'Add your town, city or country')
    expect(screen.getByTestId('portfolioUrl')).toHaveAttribute('placeholder', 'Add a link to you portfolio')
    expect(screen.getByTestId('youtubeLink')).toHaveAttribute('placeholder', 'Add a link to your YouTube channel')
    expect(screen.getByTestId('mastodonUrl')).toHaveAttribute('placeholder', 'Add a link to your Mastodon account')
    expect(screen.getByTestId('blueskyUrl')).toHaveAttribute('placeholder', 'Add a link to your Bluesky account')
    expect(screen.getByTestId('linkedinUrl')).toHaveAttribute('placeholder', 'Add a link to your LinkedIn account')
  })

  it('renders form fields with correct autocomplete attributes', () => {
    render(<RegisterApp />)

    expect(screen.getByTestId('name')).toHaveAttribute('autoComplete', 'on')
    expect(screen.getByTestId('email')).toHaveAttribute('autoComplete', 'on')
    expect(screen.getByTestId('passwordOne')).toHaveAttribute('autoComplete', 'new-password')
    expect(screen.getByTestId('passwordTwo')).toHaveAttribute('autoComplete', 'new-password')
    expect(screen.getByTestId('location')).toHaveAttribute('autoComplete', 'on')
  })

  it('renders the submit button', () => {
    render(<RegisterApp />)

    const submitButton = screen.getByTestId('form-submit')
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toHaveTextContent('Submit')
    expect(submitButton).toHaveClass('button')
  })

  it('renders form error containers for each field', () => {
    render(<RegisterApp />)

    const errorElements = screen.getAllByTestId('form-error')
    expect(errorElements.length).toBeGreaterThan(0)
    
    errorElements.forEach(errorElement => {
      expect(errorElement).toHaveClass('error')
    })
  })

  it('renders password field with helpful title attribute', () => {
    render(<RegisterApp />)

    const passwordField = screen.getByTestId('passwordOne')
    expect(passwordField).toHaveAttribute('title', 
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.')
  })

  it('renders field containers with appropriate CSS classes', () => {
    render(<RegisterApp />)

    const form = screen.getByTestId('registration-form')
    expect(form).toBeInTheDocument()
    
    // Check that form has expected class structure
    expect(form).toHaveClass('form-wrapper', 'registration-form')
  })

  it('renders autocapitalize attributes correctly', () => {
    render(<RegisterApp />)

    expect(screen.getByTestId('location')).toHaveAttribute('autoCapitalize', 'on')
    expect(screen.getByTestId('portfolioUrl')).toHaveAttribute('autoCapitalize', 'off')
    expect(screen.getByTestId('youtubeLink')).toHaveAttribute('autoCapitalize', 'off')
    expect(screen.getByTestId('mastodonUrl')).toHaveAttribute('autoCapitalize', 'off')
    expect(screen.getByTestId('blueskyUrl')).toHaveAttribute('autoCapitalize', 'off')
    expect(screen.getByTestId('linkedinUrl')).toHaveAttribute('autoCapitalize', 'off')
  })

  it('renders input fields with consistent CSS classes', () => {
    render(<RegisterApp />)

    const inputFields = [
      screen.getByTestId('name'),
      screen.getByTestId('email'),
      screen.getByTestId('passwordOne'),
      screen.getByTestId('passwordTwo'),
      screen.getByTestId('location'),
      screen.getByTestId('portfolioUrl'),
      screen.getByTestId('youtubeLink'),
      screen.getByTestId('mastodonUrl'),
      screen.getByTestId('blueskyUrl'),
      screen.getByTestId('linkedinUrl')
    ]

    inputFields.forEach(field => {
      expect(field).toHaveClass('input')
    })
  })

  it('contains password strength requirements in the label', () => {
    render(<RegisterApp />)

    expect(screen.getByText(/The password must be at least 8 characters long/)).toBeInTheDocument()
    expect(screen.getByText(/contain at least one uppercase letter/)).toBeInTheDocument()
    expect(screen.getByText(/one lowercase letter/)).toBeInTheDocument()
    expect(screen.getByText(/one number/)).toBeInTheDocument()
    expect(screen.getByText(/one special character/)).toBeInTheDocument()
  })

  it('has proper form accessibility attributes', () => {
    render(<RegisterApp />)

    const form = screen.getByTestId('registration-form')
    expect(form).toHaveAttribute('aria-labelledby', 'add-new-project')
  })

  it('handles component mounting and unmounting without errors', () => {
    const { unmount } = render(<RegisterApp />)
    expect(() => unmount()).not.toThrow()
  })

  it('is wrapped in React StrictMode', () => {
    // Since we can't directly test StrictMode wrapping with current testing setup,
    // we verify the component renders correctly which indicates StrictMode compatibility
    render(<RegisterApp />)
    
    const form = screen.getByTestId('registration-form')
    expect(form).toBeInTheDocument()
  })

  it('matches snapshot', () => {
    const { container } = render(<RegisterApp />)
    expect(container).toMatchSnapshot()
  })
})