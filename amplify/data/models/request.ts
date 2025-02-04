import { a } from '@aws-amplify/backend'

export const Request = a.customType({
  // Required fields
  requestId: a.string().required(),

  // Entity relationships
  buyerId: a.string(),
  supplierId: a.string(),
  investorId: a.string(),
  brokerId: a.string(),
  spvId: a.string(),

  // Transaction IDs
  transactionId_payout: a.string(),
  transactionId_payback: a.string(),
  identityId: a.string(),

  // Entity names and contacts
  buyer_name: a.string(),
  supplier_name: a.string(),
  investor_email: a.string(),

  // Rate and fee information
  advance_rate: a.string(),
  spv_fee_rate: a.string(),
  spv_fee_amount: a.string(),
  broker_fee_rate: a.string(),
  broker_fee_amount: a.string(),
  discount_fee_rate: a.string(),
  discount_fee_rate_adjusted: a.string(),
  discount_fee_amount: a.string(),
  transaction_fee_rate: a.string(),
  transaction_fee_amount: a.string(),
  base_rate: a.string(),
  base_rate_amount: a.string(),

  // Purchase order information
  purchase_order_amount: a.string(),
  purchase_order_attachment: a.string(),
  purchase_order_date: a.string(),
  purchase_order_number: a.string(),
  sold_goods_description: a.string(),

  // Invoice details
  invoice_amount: a.string(),
  invoice_purchase_amount: a.string(),
  invoice_purchase_duration: a.string(),
  invoice_currency: a.string(),
  invoice_date: a.string(),
  invoice_due_date: a.string(),
  invoice_attachment: a.string(),
  invoice_number: a.string(),

  // Notice and signature attachments
  offer_notice_attachment: a.string(),
  raa_offer_notice_attachment: a.string(),
  invoice_ipu_signed: a.string(),
  ipu_attachment: a.string(),

  // E-signature information
  ipu_signature_name: a.string(),
  ipu_signature_email: a.string(),
  ipu_e_signatureId: a.string(),
  offer_notice_e_signatureId: a.string(),
  raa_offer_notice_e_signatureId: a.string(),

  // Insurance and shipping
  cargo_insurance_name: a.string(),
  cargo_insurance_attachment: a.string(),
  bill_of_lading_no: a.string(),
  bill_of_lading_attachment: a.string(),
  container_no: a.string(),
  packing_list_attachment: a.string(),

  // Timestamps and dates
  createdAt: a.string(),
  payout_date: a.string(),
  payback_date: a.string(),

  // Status fields
  request_status: a.string(),
  bookkeeping_status_admin: a.string(),
  bookkeeping_status_spv: a.string(),

  // Sorting and user information
  sortkey: a.string(),
  userId: a.string().required()
})
