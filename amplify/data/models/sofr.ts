import { a } from '@aws-amplify/backend'

export const SOFR = a
  .model({
    userId: a.string(),
    SOFR: a.string(),
    SOFRM1: a.string(),
    SOFRM3: a.string(),
    SOFRM6: a.string(),
    SOFRM12: a.string(),
    updatedAt: a.string(),
    createdAt: a.string()
  })
  .authorization(allow => [
    allow.owner().identityClaim('custom:groupid'),
    allow.group('Investor').to(['create', 'read', 'update']),
    allow.group('Admin'),
    allow.group('SPV').to(['create', 'read', 'update']),
    allow.publicApiKey().to(['read', 'create', 'update'])
  ])
