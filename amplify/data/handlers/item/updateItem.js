import { util } from '@aws-appsync/utils'

export function request(ctx) {
  const { id, ...values } = ctx.args

  // Validate id
  if (!id) {
    util.error('Missing required field: id')
  }

  // Remove null/undefined values and build expressions
  const expNames = {}
  const expValues = {}
  const updateExpressions = []

  Object.entries(values).forEach(([key, value]) => {
    if (value != null) {
      const attrName = `#${key}`
      const attrValue = `:${key}`

      expNames[attrName] = key
      expValues[attrValue] = value
      updateExpressions.push(`${attrName} = ${attrValue}`)
    }
  })

  // Add updated timestamp
  expValues[':updatedAt'] = util.time.nowISO8601()
  expNames['#updatedAt'] = 'updatedAt'
  updateExpressions.push('#updatedAt = :updatedAt')

  // Check if there are any updates
  if (updateExpressions.length === 0) {
    util.error('No valid update values provided')
  }

  return {
    operation: 'UpdateItem',
    key: util.dynamodb.toMapValues({ id }),
    update: {
      expression: `SET ${updateExpressions.join(', ')}`,
      expressionNames: expNames,
      expressionValues: util.dynamodb.toMapValues(expValues)
    },
    condition: {
      expression: 'attribute_exists(id)'
    }
  }
}

export function response(ctx) {
  const { error, result } = ctx

  if (error) {
    if (error.type === 'DynamoDB:ConditionalCheckFailedException') {
      util.error('Item not found', 'NotFound')
    }

    util.error(error.message, error.type)
  }

  return result
}
