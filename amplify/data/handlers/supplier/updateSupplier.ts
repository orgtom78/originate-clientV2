import type { HandlerContext } from '../common/types'
import { handleError } from '../common/errors'
import { validateSupplierInput } from '../common/validation'
import { updateDatabase } from '../common/db'

export async function handler(ctx: HandlerContext) {
  try {
    const { id, input } = ctx.arguments

    validateSupplierInput(input)

    // Add metadata
    const updateData = {
      ...input,
      updatedAt: new Date().toISOString()
    }

    const result = await updateDatabase('Supplier', id, updateData)

    if (!result.success) {
      throw result.error
    }

    return result.data
  } catch (error) {
    return handleError(error)
  }
}
