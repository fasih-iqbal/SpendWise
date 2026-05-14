'use client'
import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    if (process.env.NODE_ENV === 'development') console.error(error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 40,
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: 40 }}>⚠️</span>
          <p
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 600,
              fontSize: 16,
              color: 'rgb(var(--text-1))',
              marginTop: 12,
              marginBottom: 8,
            }}
          >
            Something went wrong
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: '8px 20px',
              borderRadius: 12,
              background: 'rgb(var(--accent))',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-dm)',
              fontSize: 14,
            }}
          >
            Try Again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
