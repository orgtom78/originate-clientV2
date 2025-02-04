import { a } from '@aws-amplify/backend'

export const Document = a.customType({
  documentId: a.string(),
  userId: a.string().required(),
  identityId: a.string(),
  bankId: a.string(),
  brokerId: a.string(),
  spvId: a.string(),
  buyerId: a.string(),
  directorId: a.string(),
  financialsId: a.string(),
  investorId: a.string(),
  requestId: a.string(),
  supplierId: a.string(),
  transactionId: a.string(),
  uboId: a.string(),
  document_type: a.string(),
  document_attachment: a.string(),
  createdAt: a.string(),
  sortkey: a.string()
})
