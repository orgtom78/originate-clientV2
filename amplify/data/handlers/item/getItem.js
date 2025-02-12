import { get } from '@aws-appsync/utils/dynamodb'

export function request(ctx) {
  return get({ key: { id: ctx.args.id } })
}

export const response = ctx => ctx.result
