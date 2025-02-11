import { a } from '@aws-amplify/backend'

export const Insurance = a.customType({
  // Required fields
  insuranceId: a.string().required(),

  // Entity relationships
  groupId: a.string(),
  userId: a.string(),
  investorId: a.string(),
  supplierId: a.string(),
  brokerId: a.string(),
  spvId: a.string(),
  buyerId: a.string(),
  identityId: a.string(),

  // Insurance details
  insurance_type: a.string(),
  insurance_name: a.string(),
  insurance_supplier_uuid: a.string(),
  insurance_supplier_duns: a.string(),
  insurance_buyer_uuid: a.string(),
  insurance_buyer_duns: a.string(),

  // Cover information
  insurance_cover_amount: a.string(),
  insurance_cover_currency: a.string(),
  insurance_cover_start_date: a.string(),
  insurance_cover_end_date: a.string(),
  insurance_cover_status: a.string(),
  insurance_cover_type: a.string(),
  insurance_cover_premium: a.string(),
  insurance_cover_premium_currency: a.string(),
  insurance_cover_collateral_currency: a.string(),
  insurance_cover_exchange_rate: a.string(),

  // Single invoice cover details
  insurance_single_invoice_cover_amount: a.string(),
  insurance_single_invoice_cover_currency: a.string(),
  insurance_single_invoice_cover_start_date: a.string(),
  insurance_single_invoice_cover_end_date: a.string(),
  insurance_single_invoice_cover_status: a.string(),
  insurance_single_invoice_cover_premium: a.string(),
  insurance_single_invoice_cover_premium_currency: a.string(),
  insurance_single_invoice_cover_collateral_currency: a.string(),
  insurance_single_invoice_exchange_rate: a.string(),

  // Contact information
  group_contact_name: a.string(),
  group_contact_email: a.string(),
  group_contact_phone: a.string(),
  user_email: a.string(),
  user_role: a.string(),

  // Timestamps and sorting
  createdAt: a.string(),
  sortkey: a.string()
})
