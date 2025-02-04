import type { HandlerContext } from '../common/types'
import { handleError } from '../common/errors'
import { deleteFromDatabase } from '../common/db'

export async function handler(ctx: HandlerContext) {
  try {
    const { id } = ctx.arguments
    const result = await deleteFromDatabase('Supplier', id)

    if (!result.success) {
      throw result.error
    }

    return { id }
  } catch (error) {
    return handleError(error)
  }
}
