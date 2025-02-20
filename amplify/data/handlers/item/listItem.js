/* eslint-disable import/namespace */
import * as ddb from '@aws-appsync/utils/dynamodb'

export function request(ctx) {
  const { limit = 100, nextToken } = ctx.args

  return ddb.scan({ limit, nextToken })
}

export function response(ctx) {
  // Return both items and nextToken in the proper structure
  return {
    items: ctx.result.items || [],
    nextToken: ctx.result.nextToken
  }
}
