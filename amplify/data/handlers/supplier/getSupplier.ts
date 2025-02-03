import type { HandlerContext } from '../common/types'

import { handleError } from '../common/errors'
import { querySupplier } from '../common/db'

export async function handler(ctx: HandlerContext) {
  try {
    const { id } = ctx.arguments

    // Validate id exists
    if (!id) {
      throw new Error('ID is required')
    }

    const result = await querySupplier(id)

    if (!result.success) {
      throw result.error
    }

    return result.data
  } catch (error) {
    return handleError(error)
  }
}
