import { util } from '@aws-appsync/utils'

export function request(ctx) {
  return {
    operation: 'getItem',
    key: util.dynamodb.toMapValues({ key: { id: ctx.args.id } }),
    consistentRead: true
  }
}

export const response = ctx => ctx.result
