import { a } from '@aws-amplify/backend'

export const createSupplier = a
  .mutation()
  .arguments({
    input: a.ref('Supplier').required()
  })
  .returns(a.ref('Supplier'))
  .authorization(allow => [allow.authenticated()])
  .handler(
    a.handler.custom({
      dataSource: 'SupplierTable',
      entry: './handlers/supplier/createSupplier.js'
    })
  )

export const updateSupplier = a
  .mutation()
  .arguments({
    id: a.id().required(),
    input: a.ref('Supplier').required()
  })
  .returns(a.ref('Supplier'))
  .authorization(allow => [allow.authenticated()])
  .handler(
    a.handler.custom({
      dataSource: 'SupplierTable',
      entry: './handlers/supplier/updateSupplier.js'
    })
  )

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
      entry: './handlers/supplier/deleteSupplier.js'
    })
  )
