import { ValidationError, DatabaseError, AuthorizationError } from './types'

// Base error type
export class ApplicationError extends Error {
  constructor(
    public code: string,
    message: string
  ) {
    super(message)
    this.name = 'ApplicationError'
  }
}

// Main error handler
export function handleError(error: unknown): never {
  // If it's one of our custom errors, rethrow it
  if (error instanceof ValidationError || error instanceof DatabaseError || error instanceof AuthorizationError) {
    throw error
  }

  // Convert native Error to specific error types
  if (error instanceof Error) {
    // Map to specific error types based on message content
    if (error.message.toLowerCase().includes('validation')) {
      throw new ValidationError(error.message)
    }

    if (error.message.toLowerCase().includes('database')) {
      throw new DatabaseError(error.message)
    }

    if (
      error.message.toLowerCase().includes('permission') ||
      error.message.toLowerCase().includes('unauthorized') ||
      error.message.toLowerCase().includes('auth')
    ) {
      throw new AuthorizationError(error.message)
    }

    // If no specific type matches, wrap in ApplicationError
    throw new ApplicationError('INTERNAL_ERROR', error.message)
  }

  // Handle non-Error objects
  if (error && typeof error === 'object') {
    throw new ApplicationError(
      'UNKNOWN_ERROR',
      'An unknown error occurred with the following details: ' + JSON.stringify(error)
    )
  }

  // Handle primitive error values
  throw new ApplicationError('UNKNOWN_ERROR', typeof error === 'string' ? error : 'An unknown error occurred')
}

// Helper function to create consistent error messages
export function createErrorMessage(type: string, details: string): string {
  return `${type.toUpperCase()}: ${details}`
}

// Specific error handlers
export function handleValidationError(message: string): never {
  throw new ValidationError(createErrorMessage('Validation Error', message))
}

export function handleDatabaseError(message: string): never {
  throw new DatabaseError(createErrorMessage('Database Error', message))
}

export function handleAuthorizationError(message: string): never {
  throw new AuthorizationError(createErrorMessage('Authorization Error', message))
}

// Utility function to check if an error is one of our custom types
export function isCustomError(error: unknown): boolean {
  return (
    error instanceof ValidationError ||
    error instanceof DatabaseError ||
    error instanceof AuthorizationError ||
    error instanceof ApplicationError
  )
}

// Utility function to create error response objects
export function createErrorResponse(error: unknown) {
  if (isCustomError(error)) {
    return {
      success: false,
      error: error
    }
  }

  return {
    success: false,
    error: new ApplicationError('UNKNOWN_ERROR', error instanceof Error ? error.message : 'An unknown error occurred')
  }
}
