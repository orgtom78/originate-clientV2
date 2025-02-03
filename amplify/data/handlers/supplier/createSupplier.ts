import type { HandlerContext } from '../common/types'
import { handleError } from '../common/errors'
import { validateSupplierInput } from '../common/validation'
import { insertIntoDatabase } from '../common/db'

export async function handler(ctx: HandlerContext) {
  try {
    const { input } = ctx.arguments

    validateSupplierInput(input)

    // Add metadata
    const supplierData = {
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const result = await insertIntoDatabase('Supplier', supplierData)

    if (!result.success) {
      throw result.error
    }

    return result.data
  } catch (error) {
    return handleError(error)
  }
}
