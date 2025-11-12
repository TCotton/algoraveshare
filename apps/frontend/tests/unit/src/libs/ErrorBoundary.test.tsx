import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import ErrorBoundary from '../../../../src/libs/ErrorBoundary'

// Component that throws an error for testing purposes
const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div data-testid='working-component'>Working Component</div>
}

describe('ErrorBoundary', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    // Mock console.error to prevent error output during tests
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.clearAllMocks()
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  describe('when no error occurs', () => {
    it('renders children normally', () => {
      render(
        <ErrorBoundary>
          <div data-testid='child-component'>Child Component</div>
        </ErrorBoundary>
      )

      expect(screen.getByTestId('child-component')).toBeInTheDocument()
      expect(screen.getByText('Child Component')).toBeInTheDocument()
    })

    it('renders multiple children normally', () => {
      render(
        <ErrorBoundary>
          <div data-testid='child-1'>Child 1</div>
          <div data-testid='child-2'>Child 2</div>
          <span data-testid='child-3'>Child 3</span>
        </ErrorBoundary>
      )

      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
      expect(screen.getByTestId('child-3')).toBeInTheDocument()
    })

    it('renders complex nested components normally', () => {
      render(
        <ErrorBoundary>
          <div>
            <h1 data-testid='title'>Title</h1>
            <div>
              <p data-testid='paragraph'>Some text</p>
              <button data-testid='button'>Click me</button>
            </div>
          </div>
        </ErrorBoundary>
      )

      expect(screen.getByTestId('title')).toBeInTheDocument()
      expect(screen.getByTestId('paragraph')).toBeInTheDocument()
      expect(screen.getByTestId('button')).toBeInTheDocument()
    })

    it('does not show error UI when no error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      )

      expect(screen.getByTestId('working-component')).toBeInTheDocument()
      expect(screen.queryByText('Sorry.. there was an error')).not.toBeInTheDocument()
    })
  })

  describe('when an error occurs', () => {
    it('catches errors and displays fallback UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Sorry.. there was an error')).toBeInTheDocument()
      expect(screen.queryByTestId('working-component')).not.toBeInTheDocument()
    })

    it('displays fallback UI as h1 element', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      const errorMessage = screen.getByText('Sorry.. there was an error')
      expect(errorMessage).toBeInTheDocument()
      expect(errorMessage.tagName).toBe('H1')
    })

    it('calls console.error with error details', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      // React itself might also call console.error, so we check that our specific call happened
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Uncaught error:',
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String)
        })
      )
    })

    it('logs the correct error message', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      const loggedError = consoleErrorSpy.mock.calls[0][1] as Error
      expect(loggedError.message).toBe('Test error')
    })

    it('catches errors in deeply nested components', () => {
      const NestedThrowError = () => (
        <div>
          <div>
            <div>
              <ThrowError shouldThrow={true} />
            </div>
          </div>
        </div>
      )

      render(
        <ErrorBoundary>
          <NestedThrowError />
        </ErrorBoundary>
      )

      expect(screen.getByText('Sorry.. there was an error')).toBeInTheDocument()
    })

    it('prevents error from bubbling up to parent components', () => {
      const parentErrorHandler = vi.fn()

      // Create a parent component that would handle errors
      const ParentComponent = () => {
        try {
          return (
            <div>
              <ErrorBoundary>
                <ThrowError shouldThrow={true} />
              </ErrorBoundary>
            </div>
          )
        } catch (error) {
          parentErrorHandler(error)
          return <div>Parent caught error</div>
        }
      }

      render(<ParentComponent />)

      expect(screen.getByText('Sorry.. there was an error')).toBeInTheDocument()
      expect(screen.queryByText('Parent caught error')).not.toBeInTheDocument()
      expect(parentErrorHandler).not.toHaveBeenCalled()
    })
  })

  describe('error recovery', () => {
    it('maintains error state after error occurs', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Sorry.. there was an error')).toBeInTheDocument()

      // Re-render with non-throwing component
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      )

      // Error boundary should still show error state
      expect(screen.getByText('Sorry.. there was an error')).toBeInTheDocument()
      expect(screen.queryByTestId('working-component')).not.toBeInTheDocument()
    })
  })

  describe('component lifecycle', () => {
    it('has correct initial state', () => {
      const { container } = render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      )

      expect(container.firstChild).toBeInTheDocument()
      expect(screen.getByText('Test content')).toBeInTheDocument()
    })

    it('handles unmounting without errors', () => {
      const { unmount } = render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      )

      expect(() => unmount()).not.toThrow()
    })

    it('handles unmounting after error without issues', () => {
      const { unmount } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Sorry.. there was an error')).toBeInTheDocument()
      expect(() => unmount()).not.toThrow()
    })
  })

  describe('edge cases', () => {
    it('handles ErrorBoundary with no children', () => {
      render(<ErrorBoundary />)
      
      // Should render nothing but not crash
      expect(document.body).toBeInTheDocument()
    })

    it('handles ErrorBoundary with null children', () => {
      render(<ErrorBoundary>{null}</ErrorBoundary>)
      
      // Should render nothing but not crash
      expect(document.body).toBeInTheDocument()
    })

    it('handles ErrorBoundary with undefined children', () => {
      render(<ErrorBoundary>{undefined}</ErrorBoundary>)
      
      // Should render nothing but not crash
      expect(document.body).toBeInTheDocument()
    })

    it('handles different types of errors', () => {
      const ThrowTypeError = () => {
        throw new TypeError('Type error occurred')
      }

      render(
        <ErrorBoundary>
          <ThrowTypeError />
        </ErrorBoundary>
      )

      expect(screen.getByText('Sorry.. there was an error')).toBeInTheDocument()
      
      const loggedError = consoleErrorSpy.mock.calls[0][1] as Error
      expect(loggedError.message).toBe('Type error occurred')
      expect(loggedError).toBeInstanceOf(TypeError)
    })

    it('handles errors with empty error messages', () => {
      const ThrowEmptyError = () => {
        throw new Error('')
      }

      render(
        <ErrorBoundary>
          <ThrowEmptyError />
        </ErrorBoundary>
      )

      expect(screen.getByText('Sorry.. there was an error')).toBeInTheDocument()
      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    it('error message is accessible as heading', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      const errorHeading = screen.getByRole('heading', { level: 1 })
      expect(errorHeading).toBeInTheDocument()
      expect(errorHeading).toHaveTextContent('Sorry.. there was an error')
    })
  })

  describe('getDerivedStateFromError static method', () => {
    it('returns correct state when error occurs', () => {
      // Test the static method directly
      const error = new Error('Test error')
      const newState = ErrorBoundary.getDerivedStateFromError(error)
      
      expect(newState).toEqual({ hasError: true })
    })
  })
})