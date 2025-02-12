import { util } from '@aws-appsync/utils'

export function request(ctx) {
  const item = { ...ctx.arguments, ups: 1, downs: 0, version: 1 }
  const key = { id: ctx.args.id ?? util.autoId() }
  const { ...values } = ctx.args

  return {
    operation: 'PutItem',
    key: util.dynamodb.toMapValues({ key, item }),
    attributeValues: util.dynamodb.toMapValues(values)
  }
}

export function response(ctx) {
  return ctx.result
}
