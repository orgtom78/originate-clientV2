import type { HandlerContext } from '../common/types'
import { handleError } from '../common/errors'
import { queryDatabase } from '../common/db'

export async function handler(ctx: HandlerContext) {
  try {
    const { limit = 10, nextToken } = ctx.arguments
    const result = await queryDatabase('Supplier', '*', { limit, nextToken })

    if (!result.success) {
      throw result.error
    }

    return result.data
  } catch (error) {
    return handleError(error)
  }
}
