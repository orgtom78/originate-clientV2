import { a } from '@aws-amplify/backend'

export const UBO = a.customType({
  // Required fields
  uboId: a.string().required(),
  userId: a.string().required(),

  // Entity relationships
  supplierId: a.string(),
  buyerId: a.string(),
  investorId: a.string(),
  brokerId: a.string(),
  spvId: a.string(),
  identityId: a.string(),

  // Personal information
  ubo_name: a.string(),
  ubo_email: a.string(),
  ubo_phone_number: a.string(),
  ubo_date_of_birth: a.string(),
  ubo_nationality: a.string(),
  ubo_country_of_residence: a.string(),
  ubo_jobtitle: a.string(),
  ubo_ownership_percentage: a.string(),

  // ID information
  ubo_id_type: a.string(),
  ubo_id_number: a.string(),
  ubo_id_issuer_country: a.string(),
  ubo_id_issuer_state: a.string(),
  ubo_id_issue_date: a.string(),
  ubo_id_expiry_date: a.string(),
  ubo_id_attachment: a.string(),
  ubo_poa_attachment: a.string(),

  // Status and compliance
  ubo_status: a.string(),
  ubo_pep_status: a.string(),
  ubo_appointment_date: a.string(),

  // Timestamps and sorting
  createdAt: a.string(),
  sortkey: a.string()
})
