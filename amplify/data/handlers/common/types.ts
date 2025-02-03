// Base error classes
export class DatabaseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthorizationError'
  }
}

// Handler context types
export interface HandlerContext {
  arguments: {
    id: string
    input?: Record<string, any>
    limit?: number
    nextToken?: string
  }
  source: string
  result?: any
  identity?: {
    claims: {
      sub: string
      'custom:groupid': string
      email: string
    }
  }
}

// Query argument types
export interface GetQueryArgs {
  id: string
}

export interface ListQueryArgs {
  limit?: number
  nextToken?: string
  filter?: Record<string, any>
}

// Mutation argument types
export interface CreateMutationArgs<T> {
  input: T
}

export interface UpdateMutationArgs<T> {
  id: string
  input: T
}

export interface DeleteMutationArgs {
  id: string
}

// Database response types
export interface DatabaseResponse<T = any> {
  success: boolean
  data?: T
  error?: Error
}
