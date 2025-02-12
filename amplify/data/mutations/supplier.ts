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
      dataSource: 'supplierTable',
      entry: '../handlers/item/deleteItem.js'
    })
  )
