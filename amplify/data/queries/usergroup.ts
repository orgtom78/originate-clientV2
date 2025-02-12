// /amplify/data/queries/supplier.ts
import { a } from '@aws-amplify/backend'

export const getUsergroup = a
  .query()
  .arguments({ id: a.id().required() })
  .returns(a.ref('Usergroup'))
  .authorization(allow => [allow.authenticated()])
  .handler(
    a.handler.custom({
      dataSource: 'usergroupTable',
      entry: '../handlers/item/getItem.js'
    })
  )
