import type { DatabaseResponse } from './types'
import { DatabaseError } from './types'

// Generic database operations
export async function queryDatabase<T>(
  tableName: string,
  id: string,
  options?: {
    limit?: number
    nextToken?: string
    filter?: Record<string, any>
  }
): Promise<DatabaseResponse<T>> {
  try {
    if (!id) {
      throw new DatabaseError(`${tableName} ID is required`)
    }

    // Build query parameters
    const queryParams = new URLSearchParams()

    if (options?.limit) queryParams.append('limit', options.limit.toString())
    if (options?.nextToken) queryParams.append('nextToken', options.nextToken)
    if (options?.filter) queryParams.append('filter', JSON.stringify(options.filter))

    const result = await fetch(`/api/${tableName}/${id}?${queryParams.toString()}`)

    if (!result.ok) {
      throw new DatabaseError(`Failed to query ${tableName}`)
    }

    const data = await result.json()

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new DatabaseError('Unknown database error')
    }
  }
}

// Model-specific query functions
export async function querySupplier(id: string): Promise<DatabaseResponse<any>> {
  return queryDatabase('Supplier', id)
}

export async function queryBuyer(id: string): Promise<DatabaseResponse<any>> {
  return queryDatabase('Buyer', id)
}

export async function queryFinancials(id: string): Promise<DatabaseResponse<any>> {
  return queryDatabase('Financials', id)
}

export async function queryRequest(id: string): Promise<DatabaseResponse<any>> {
  return queryDatabase('Request', id)
}

// Database operations
export async function insertIntoDatabase<T>(
  tableName: string,
  data: Record<string, any>
): Promise<DatabaseResponse<T>> {
  try {
    if (!data) {
      throw new DatabaseError('Data is required for insertion')
    }

    const result = await fetch(`/api/${tableName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (!result.ok) {
      throw new DatabaseError(`Failed to insert into ${tableName}`)
    }

    const responseData = await result.json()

    return { success: true, data: responseData }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new DatabaseError('Unknown database error')
    }
  }
}

export async function updateDatabase<T>(
  tableName: string,
  id: string,
  data: Record<string, any>
): Promise<DatabaseResponse<T>> {
  try {
    if (!id) {
      throw new DatabaseError('ID is required for update')
    }

    if (!data) {
      throw new DatabaseError('Data is required for update')
    }

    const result = await fetch(`/api/${tableName}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (!result.ok) {
      throw new DatabaseError(`Failed to update ${tableName}`)
    }

    const responseData = await result.json()

    return { success: true, data: responseData }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new DatabaseError('Unknown database error')
    }
  }
}

export async function deleteFromDatabase(tableName: string, id: string): Promise<DatabaseResponse<void>> {
  try {
    if (!id) {
      throw new DatabaseError('ID is required for deletion')
    }

    const result = await fetch(`/api/${tableName}/${id}`, {
      method: 'DELETE'
    })

    if (!result.ok) {
      throw new DatabaseError(`Failed to delete from ${tableName}`)
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new DatabaseError('Unknown database error')
    }
  }
}
