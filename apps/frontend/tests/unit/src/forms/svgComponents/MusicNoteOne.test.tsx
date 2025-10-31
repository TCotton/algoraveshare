import { render } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'

import MusicNoteOne from '../../../../../src/forms/svgComponents/MusicNoteOne'

describe('MusicNoteOne', () => {
  it('renders svg element with correct attributes', () => {
    const { container } = render(<MusicNoteOne />)

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg')
    expect(svg).toHaveAttribute('viewBox', '0,0,256,256')
    expect(svg).toHaveAttribute('width', '144px')
    expect(svg).toHaveAttribute('height', '144px')
    expect(svg).toHaveAttribute('fill-rule', 'nonzero')
    expect(svg).toHaveClass('svg-icon')
  })

  it('renders all five path elements with correct classes', () => {
    const { container } = render(<MusicNoteOne />)

    const pathOne = container.querySelector('.path-one')
    const pathTwo = container.querySelector('.path-two')
    const pathThree = container.querySelector('.path-three')
    const pathFour = container.querySelector('.path-four')
    const pathFive = container.querySelector('.path-five')

    expect(pathOne).toBeInTheDocument()
    expect(pathTwo).toBeInTheDocument()
    expect(pathThree).toBeInTheDocument()
    expect(pathFour).toBeInTheDocument()
    expect(pathFive).toBeInTheDocument()
  })

  it('all paths have data-animation attribute set to stop', () => {
    const { container } = render(<MusicNoteOne />)

    const paths = container.querySelectorAll('path')
    expect(paths).toHaveLength(5)

    paths.forEach((path) => {
      expect(path).toHaveAttribute('data-animation', 'stop')
    })
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<SVGSVGElement>()

    render(<MusicNoteOne ref={ref} />)

    expect(ref.current).toBeInstanceOf(SVGSVGElement)
    expect(ref.current?.tagName).toBe('svg')
  })

  it('accepts additional SVG props via rest props', () => {
    const { container } = render(
      <MusicNoteOne
        data-testid='custom-svg'
        aria-label='Music note icon'
        id='custom-id'
        style={{ opacity: 0.5 }}
      />
    )

    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('data-testid', 'custom-svg')
    expect(svg).toHaveAttribute('aria-label', 'Music note icon')
    expect(svg).toHaveAttribute('id', 'custom-id')
    expect(svg).toHaveStyle({ opacity: '0.5' })
  })

  it('allows custom className to override default class', () => {
    const { container } = render(<MusicNoteOne className='custom-class' />)

    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('custom-class')
    expect(svg).not.toHaveClass('svg-icon')
  })

  it('supports imperative DOM access via ref', () => {
    const ref = React.createRef<SVGSVGElement>()

    render(<MusicNoteOne ref={ref} />)

    // Test that we can query paths through the ref
    const paths = ref.current?.querySelectorAll('path')
    expect(paths).toHaveLength(5)
  })

  it('allows style manipulation through ref', () => {
    const ref = React.createRef<SVGSVGElement>()

    render(<MusicNoteOne ref={ref} />)

    // Test that we can manipulate animation-play-state on paths
    const paths = ref.current?.querySelectorAll('path')
    paths?.forEach((path) => {
      const svgPath = path as SVGPathElement
      svgPath.style.animationPlayState = 'running'
      expect(svgPath.style.animationPlayState).toBe('running')
    })
  })

  it('has correct displayName', () => {
    expect(MusicNoteOne.displayName).toBe('MusicNoteOne')
  })

  it('renders g element with correct stroke attributes', () => {
    const { container } = render(<MusicNoteOne />)

    const g = container.querySelector('g[fill="none"]')
    expect(g).toBeInTheDocument()
    expect(g).toHaveAttribute('stroke', '#b4befe')
    expect(g).toHaveAttribute('stroke-width', '3')
    expect(g).toHaveAttribute('stroke-linecap', 'round')
    expect(g).toHaveAttribute('stroke-linejoin', 'round')
  })

  it('matches snapshot', () => {
    const { container } = render(<MusicNoteOne />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
