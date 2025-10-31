import { render, screen } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import SelectForm from '../../../../src/forms/SelectForm'

vi.mock('@ariakit/react', () => ({
  __esModule: true,
  useSelectStore: vi.fn(() => ({})),
  Select: (props: any) => <select {...props}>{props.children}</select>,
  SelectItem: (props: any) => <option {...props}>{props.children}</option>,
  SelectPopover: (props: any) => <div {...props}>{props.children}</div>,
  SelectProvider: (props: any) => <div {...props}>{props.children}</div>,
  SelectLabel: (props: any) => <label {...props}>{props.children}</label>,
  SelectValue: () => <span>Selected Value</span>,
  SelectArrow: () => <span>▼</span>
}))

// Sample data
const items = {
  label: 'Choose a project type',
  items: [
    { value: 'Finished Project', label: 'finished' },
    { value: 'Before and After Live Coding Project', label: 'before-after' }
  ]
}

beforeEach(() => {
  render(<SelectForm label={items.label} items={items.items} name='projectType' />)
})

describe('SelectForm', () => {
  it('renders label and options', () => {
    expect(screen.getByText(/choose a project type/i)).toBeInTheDocument()
    expect(screen.getByText('Finished Project')).toBeInTheDocument()
    expect(
      screen.getByText('Before and After Live Coding Project')
    ).toBeInTheDocument()
  })

  it('renders with data-test-id attribute when provided', () => {
    const { container } = render(
      <SelectForm
        label='Test Label'
        items={items.items}
        name='testSelect'
        data-testid='my-test-select'
      />
    )

    const selectContainer = container.querySelector('[data-testid="my-test-select"]')
    expect(selectContainer).toBeInTheDocument()
    expect(selectContainer).toHaveAttribute('data-testid', 'my-test-select')
  })

  it('renders without data-test-id attribute when not provided', () => {
    const { container } = render(
      <SelectForm
        label='Test Label'
        items={items.items}
        name='testSelect'
      />
    )

    const selectContainer = container.querySelector('.select-container')
    expect(selectContainer).toBeInTheDocument()
    expect(selectContainer).not.toHaveAttribute('data-test-id')
  })

  it('renders with correct class and data-test-id together', () => {
    const { container } = render(
      <SelectForm
        label='Test Label'
        items={items.items}
        name='testSelect'
        selectClass='custom-select'
        data-testid='custom-select-testid'
      />
    )

    const selectContainer = container.querySelector('[data-testid="custom-select-testid"]')
    expect(selectContainer).toBeInTheDocument()
    expect(selectContainer).toHaveClass('select-container')
    expect(selectContainer).toHaveClass('custom-select')
    expect(selectContainer).toHaveAttribute('data-testid', 'custom-select-testid')
  })

  it('matches snapshot', () => {
    const result = <SelectForm label={items.label} items={items.items} name='projectType' />
    expect(result).toMatchSnapshot()
  })

  it('matches snapshot with data-test-id', () => {
    const result = (
      <SelectForm
        label={items.label}
        items={items.items}
        name='projectType'
        data-test-id='snapshot-test-id'
      />
    )
    expect(result).toMatchSnapshot()
  })
})
