import { a } from '@aws-amplify/backend'

export const Plaidauth = a
  .model({
    accessToken1: a.string(),
    accessToken2: a.string(),
    account_id1: a.string(),
    account_id2: a.string(),
    updatedAt: a.string(),
    createdAt: a.string()
  })
  .authorization(allow => [
    allow.owner().identityClaim('custom:groupid'),
    allow.group('Broker').to(['update', 'read']),
    allow.group('Investor').to(['create', 'read', 'update']),
    allow.group('Spv').to(['create', 'read', 'update']),
    allow.group('Admin'),
    allow.publicApiKey().to(['create', 'update', 'delete', 'read']),
    allow.authenticated().to(['create', 'update', 'delete', 'read'])
  ])
