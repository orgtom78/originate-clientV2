// /amplify/data/queries/supplier.ts
import { a } from '@aws-amplify/backend'

export const getOnboarding = a
  .query()
  .arguments({ id: a.id().required() })
  .returns(a.ref('Onboarding'))
  .authorization(allow => [allow.publicApiKey()])
  .handler(
    a.handler.custom({
      dataSource: 'onboardingTable',
      entry: '../handlers/item/getItem.js'
    })
  )
