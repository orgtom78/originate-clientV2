// /amplify/data/queries/supplier.ts
import { a } from '@aws-amplify/backend'

export const getSupplier = a
  .query()
  .arguments({ id: a.id().required() })
  .returns(a.ref('Supplier'))
  .authorization(allow => [allow.authenticated()])
  .handler(
    a.handler.custom({
      dataSource: 'SupplierTable',
      entry: '../handlers/supplier/getSupplier.js'
    })
  )
