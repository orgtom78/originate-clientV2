import { type ClientSchema, a, defineData } from '@aws-amplify/backend'

import * as models from './models'

const schema = a.schema(models)

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  },
  logging: true
})
