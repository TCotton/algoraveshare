import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import DropDownMenu from '../../../../src/components/DropDownMenu'

vi.mock('@ariakit/react', () => ({
  __esModule: true,
  MenuProvider: (props: any) => <div data-testid='menu-provider' {...props}>{props.children}</div>,
  MenuButton: (props: any) => <button data-testid='menu-button' {...props}>{props.children}</button>,
  MenuButtonArrow: () => <span data-testid='menu-button-arrow'>▼</span>,
  Menu: (props: any) => <div data-testid='menu' role='menu' {...props}>{props.children}</div>,
  MenuItem: (props: any) => <div data-testid='menu-item' role='menuitem' {...props}>{props.children}</div>,
  MenuSeparator: (props: any) => <hr data-testid='menu-separator' {...props} />
}))

describe('DropDownMenu', () => {
  beforeEach(() => {
    render(<DropDownMenu />)
  })

  it('renders the menu provider', () => {
    const menuProvider = screen.getByTestId('menu-provider')
    expect(menuProvider).toBeInTheDocument()
  })

  it('renders the menu button with correct text and class', () => {
    const menuButton = screen.getByTestId('menu-button')
    expect(menuButton).toBeInTheDocument()
    expect(menuButton).toHaveTextContent('Menu')
    expect(menuButton).toHaveClass('button')
  })

  it('renders the menu button arrow', () => {
    const arrow = screen.getByTestId('menu-button-arrow')
    expect(arrow).toBeInTheDocument()
    expect(arrow).toHaveTextContent('▼')
  })

  it('renders the menu with correct class and gutter attribute', () => {
    const menu = screen.getByTestId('menu')
    expect(menu).toBeInTheDocument()
    expect(menu).toHaveClass('menu')
    expect(menu).toHaveAttribute('gutter', '8')
  })

  it('renders all menu items with correct links', () => {
    const menuItems = screen.getAllByTestId('menu-item')
    expect(menuItems).toHaveLength(3)

    // Check Home link
    const homeLink = screen.getByRole('link', { name: 'Home' })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')

    // Check Projects link
    const projectsLink = screen.getByRole('link', { name: 'Projects' })
    expect(projectsLink).toBeInTheDocument()
    expect(projectsLink).toHaveAttribute('href', '/projects')

    // Check Snippets link
    const snippetsLink = screen.getByRole('link', { name: 'Snippets' })
    expect(snippetsLink).toBeInTheDocument()
    expect(snippetsLink).toHaveAttribute('href', '/snippets')
  })

  it('renders menu items with correct class', () => {
    const menuItems = screen.getAllByTestId('menu-item')
    menuItems.forEach((item) => {
      expect(item).toHaveClass('menu-item')
    })
  })

  it('renders the menu separator', () => {
    const separator = screen.getByTestId('menu-separator')
    expect(separator).toBeInTheDocument()
    expect(separator).toHaveClass('separator')
  })

  it('matches snapshot', () => {
    const result = <DropDownMenu />
    expect(result).toMatchSnapshot()
  })
})
