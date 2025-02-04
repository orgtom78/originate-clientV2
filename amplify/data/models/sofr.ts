import { a } from '@aws-amplify/backend'

export const SOFR = a.customType({
  userId: a.string(),
  SOFR: a.string(),
  SOFRM1: a.string(),
  SOFRM3: a.string(),
  SOFRM6: a.string(),
  SOFRM12: a.string(),
  updatedAt: a.string(),
  createdAt: a.string()
})
