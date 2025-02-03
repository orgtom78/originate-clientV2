import { a } from '@aws-amplify/backend'

export const Bookkeeping = a
  .model({
    bookkeeping_status_admin: a.string(),
    bookkeeping_status_spv: a.string(),
    bookkeepingId: a.string(),
    buyerId: a.string(),
    supplierId: a.string(),
    investorId: a.string(),
    identityId: a.string(),
    requestId: a.string(),
    transactionId: a.string(),
    createdAt: a.string(),
    sortkey: a.string(),
    invoiceId_3party: a.string(),
    invoiceurl_3party: a.string(),
    invoicepdfurl_3party: a.string()
  })
  .authorization(allow => [allow.group('Admin'), allow.group('Spv')])
