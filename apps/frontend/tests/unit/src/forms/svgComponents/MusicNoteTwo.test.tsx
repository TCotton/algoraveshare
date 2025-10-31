import { render } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'

import MusicNoteTwo from '../../../../../src/forms/svgComponents/MusicNoteTwo'

describe('MusicNoteTwo', () => {
  it('renders svg element with correct attributes', () => {
    const { container } = render(<MusicNoteTwo />)

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg')
    expect(svg).toHaveAttribute('viewBox', '0,0,256,256')
    expect(svg).toHaveAttribute('width', '144px')
    expect(svg).toHaveAttribute('height', '144px')
    expect(svg).toHaveAttribute('fill-rule', 'nonzero')
    expect(svg).toHaveClass('svg-icon-two')
  })

  it('renders four path elements with path-one class', () => {
    const { container } = render(<MusicNoteTwo />)

    const pathElements = container.querySelectorAll('.path-one')
    expect(pathElements).toHaveLength(4)
  })

  it('renders an ellipse element', () => {
    const { container } = render(<MusicNoteTwo />)

    const ellipse = container.querySelector('ellipse')
    expect(ellipse).toBeInTheDocument()
    expect(ellipse).toHaveAttribute('cx', '34.5')
    expect(ellipse).toHaveAttribute('cy', '32.5')
    expect(ellipse).toHaveAttribute('rx', '6')
    expect(ellipse).toHaveAttribute('ry', '5')
  })

  it('all paths have data-animation attribute set to stop', () => {
    const { container } = render(<MusicNoteTwo />)

    const paths = container.querySelectorAll('path')
    expect(paths).toHaveLength(4)

    paths.forEach((path) => {
      expect(path).toHaveAttribute('data-animation', 'stop')
    })
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<SVGSVGElement>()

    render(<MusicNoteTwo ref={ref} />)

    expect(ref.current).toBeInstanceOf(SVGSVGElement)
    expect(ref.current?.tagName).toBe('svg')
  })

  it('accepts additional SVG props via rest props', () => {
    const { container } = render(
      <MusicNoteTwo
        data-testid='custom-svg'
        aria-label='Music note icon two'
        id='custom-id'
        style={{ opacity: 0.5 }}
      />
    )

    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('data-testid', 'custom-svg')
    expect(svg).toHaveAttribute('aria-label', 'Music note icon two')
    expect(svg).toHaveAttribute('id', 'custom-id')
    expect(svg).toHaveStyle({ opacity: '0.5' })
  })

  it('allows custom className to override default class', () => {
    const { container } = render(<MusicNoteTwo className='custom-class' />)

    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('custom-class')
    expect(svg).not.toHaveClass('svg-icon-two')
  })

  it('supports imperative DOM access via ref', () => {
    const ref = React.createRef<SVGSVGElement>()

    render(<MusicNoteTwo ref={ref} />)

    // Test that we can query paths through the ref
    const paths = ref.current?.querySelectorAll('path')
    expect(paths).toHaveLength(4)

    // Test that we can query the ellipse through the ref
    const ellipse = ref.current?.querySelector('ellipse')
    expect(ellipse).toBeInTheDocument()
  })

  it('allows style manipulation through ref', () => {
    const ref = React.createRef<SVGSVGElement>()

    render(<MusicNoteTwo ref={ref} />)

    // Test that we can manipulate animation-play-state on paths
    const paths = ref.current?.querySelectorAll('path')
    paths?.forEach((path) => {
      const svgPath = path as SVGPathElement
      svgPath.style.animationPlayState = 'running'
      expect(svgPath.style.animationPlayState).toBe('running')
    })
  })

  it('has correct displayName', () => {
    expect(MusicNoteTwo.displayName).toBe('MusicNoteTwo')
  })

  it('renders g element with correct stroke attributes', () => {
    const { container } = render(<MusicNoteTwo />)

    const g = container.querySelector('g[fill="none"]')
    expect(g).toBeInTheDocument()
    expect(g).toHaveAttribute('stroke', '#b4befe')
    expect(g).toHaveAttribute('stroke-width', '3')
    expect(g).toHaveAttribute('stroke-linecap', 'round')
    expect(g).toHaveAttribute('stroke-linejoin', 'round')
  })

  it('matches snapshot', () => {
    const { container } = render(<MusicNoteTwo />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
