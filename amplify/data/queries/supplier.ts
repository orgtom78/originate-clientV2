import { a } from '@aws-amplify/backend'

export const getSupplier = a
  .query()
  .arguments({ id: a.id().required() })
  .returns(a.ref('Supplier'))
  .authorization(allow => [allow.authenticated()])
  .handler(
    a.handler.custom({
      dataSource: 'SupplierTable',
      entry: './handlers/supplier/getSupplier.js'
    })
  )

export const listSuppliers = a
  .query()
  .arguments({
    limit: a.float(),
    nextToken: a.string(),
    filter: a
      .object({
        supplier_country: a.string(),
        supplier_industry: a.string()
      })
      .optional()
  })
  .returns(
    a.object({
      items: a.list(a.ref('Supplier')),
      nextToken: a.string().optional()
    })
  )
  .authorization(allow => [allow.authenticated()])
  .handler(
    a.handler.custom({
      dataSource: 'SupplierTable',
      entry: './handlers/supplier/listSuppliers.js'
    })
  )
