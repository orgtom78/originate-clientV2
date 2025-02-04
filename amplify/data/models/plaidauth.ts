import { a } from '@aws-amplify/backend'

export const Plaidauth = a.customType({
  accessToken1: a.string(),
  accessToken2: a.string(),
  account_id1: a.string(),
  account_id2: a.string(),
  updatedAt: a.string(),
  createdAt: a.string()
})
