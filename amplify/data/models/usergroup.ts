import { a } from '@aws-amplify/backend'

export const Usergroup = a.customType({
  // Required fields
  groupId: a.string().required(),

  // Entity relationships
  userId: a.string(),
  investorId: a.string(),
  supplierId: a.string(),
  brokerId: a.string(),
  spvId: a.string(),
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
  group_contact_phone: a.string(),

  // Timestamps and sorting
  createdAt: a.string(),
  sortkey: a.string()
})
