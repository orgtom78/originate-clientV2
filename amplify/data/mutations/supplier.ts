import { a } from '@aws-amplify/backend'

export const deleteSupplier = a
  .mutation()
  .arguments({
    id: a.id().required()
  })
  .returns(a.ref('Supplier'))
  .authorization(allow => [allow.authenticated()])
  .handler(
    a.handler.custom({
      dataSource: 'SupplierTable',
      entry: '../handlers/supplier/deleteSupplier.ts'
    })
  )
