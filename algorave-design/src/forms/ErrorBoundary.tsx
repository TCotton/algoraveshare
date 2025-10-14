import * as React from 'react'
import PropTypes from 'prop-types'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error(
      error,
      info.componentStack,
      React.captureOwnerStack(),
    )
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback
    }

    return this.props.children
  }

  static propTypes = {
    fallback: PropTypes.node,
    children: PropTypes.node,
  }
}
