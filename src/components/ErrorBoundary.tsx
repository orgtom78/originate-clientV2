// /components/ErrorBoundary.tsx
'use client'

import React from 'react'

export const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Error caught by boundary:', error)
      setHasError(true)
    }

    window.addEventListener('error', handleError)

    return () => window.removeEventListener('error', handleError)
  }, [])

  if (hasError) {
    return <div>Something went wrong. Please try again.</div>
  }

  return children
}
