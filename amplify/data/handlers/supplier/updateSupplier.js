import { util } from '@aws-appsync/utils'

export function request(ctx) {
  const { id } = ctx.args

  return {
    operation: 'UpdateItem',
    key: util.dynamodb.toMapValues({ id }),
    update: {
      expression: 'ADD #voteField :plusOne, version :plusOne',
      expressionNames: { '#voteField': 'upvotes' },
      expressionValues: { ':plusOne': { N: 1 } }
    }
  }
}
