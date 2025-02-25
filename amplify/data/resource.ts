// /amplify/data/resource.ts
import { type ClientSchema, a, defineData } from '@aws-amplify/backend'

import { myEmailSender } from '../functions/email-sender/resource'

import * as models from './models'
import * as queries from './queries'
import * as mutations from './mutations'

const schema = a
  .schema({
    ...models,
    ...queries,
    ...mutations,

    myEmailSender: a
      .query()
      .arguments({
        onboardingId: a.string(),
        type: a.enum(['direct', 'periodic'])
      })
      .returns(a.string())
      .handler(a.handler.function(myEmailSender))
      .authorization(allow => [allow.publicApiKey()])
  })
  .authorization(allow => [allow.resource(myEmailSender)])

console.log(schema)

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  },
  logging: true
})
