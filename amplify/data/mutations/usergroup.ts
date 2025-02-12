import { a } from '@aws-amplify/backend'

export const createUsergroup = a
  .mutation()
  .arguments({
    id: a.id().required(),
    groupId: a.string(),

    // Entity relationships
    naturalpersonId: a.string(),
    legalpersonId: a.string(),
    onboardingId: a.string(),
    identityId: a.string(),
    sub: a.string(),

    // User information
    user_name: a.string(),
    user_email: a.string(),
    user_role: a.string(),

    // Group information
    group_type: a.string(),
    group_name: a.string(),
    group_contact_name: a.string(),
    group_contact_email: a.string(),
    group_contact_phone: a.string()
  })
  .returns(a.ref('Usergroup'))
  .authorization(allow => [allow.authenticated()])
  .handler(
    a.handler.custom({
      dataSource: 'usergroupTable',
      entry: '../handlers/item/createItem.js'
    })
  )

export const updateUsergroup = a
  .mutation()
  .arguments({
    id: a.id().required(),
    groupId: a.string(),

    // Entity relationships
    naturalpersonId: a.string(),
    legalpersonId: a.string(),
    onboardingId: a.string(),
    identityId: a.string(),
    sub: a.string(),

    // User information
    user_name: a.string(),
    user_email: a.string(),
    user_role: a.string(),

    // Group information
    group_type: a.string(),
    group_name: a.string(),
    group_contact_name: a.string(),
    group_contact_email: a.string(),
    group_contact_phone: a.string()
  })
  .returns(a.ref('Usergroup'))
  .authorization(allow => [allow.authenticated()])
  .handler(
    a.handler.custom({
      dataSource: 'usergroupTable',
      entry: '../handlers/item/updateItem.js'
    })
  )
